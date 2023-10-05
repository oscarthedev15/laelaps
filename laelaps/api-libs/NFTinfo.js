// Setup: npm install alchemy-sdk
import { Alchemy, Network, fromHex } from "alchemy-sdk";
const { ethers } = require("ethers");
import Subscription from "../models/subscription.js";
import mongoose from "./db.js";
import { sendZeusInvite } from "./telegram.js";

const REWARD_ADDRESS = "0x48bffd60686b8259887862d0e73ac2087d446a5f";
// const SUBSCRIPTION_COST = 0.00000000000001;

const NETWORK = Network.ETH_GOERLI;
const DAYS_AGO = 0.01;

const providerNetwork = "goerli";
// const providerNetwork = "homestead"

const MONTHS = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export async function getNFTinfo(userAddress, nftAddress, chatId, bot, price) {
  const config = {
    apiKey: process.env.ALCHEMY_TOKEN,
    network: NETWORK,
  };
  const alchemy = new Alchemy(config);

  //_____________________________Code for NFT receiving: __________________________________
  const res = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toAddress: userAddress,
    excludeZeroValue: true,
    category: ["erc1155"],
  });

  let txns = res.transfers.filter(
    (txn) => txn.rawContract.address == nftAddress
  );

  if (txns.length == 0) return { message: "Not a holder" };
  const blockNumHex = txns[0].blockNum;
  const blockNumDecimal = fromHex(blockNumHex);
  const txnHash = txns[0].hash;
  const provider = new ethers.providers.AlchemyProvider(
    providerNetwork,
    process.env.ALCHEMY_TOKEN
  );
  const unixTimestamp = (await provider.getBlock(blockNumDecimal)).timestamp; //UNIX!
  // __________________________________________________________________________________

  const statusObj = await getStatus(
    userAddress,
    unixTimestamp,
    blockNumHex,
    price
  );

  const returnObj = {
    blockNum: blockNumDecimal,
    txnHash: txnHash,
    timestamp: unixTimestamp,
    mintDateObj: unixToHumanDate(unixTimestamp),
    statusObj: statusObj,
  };

  const addressInDB = await getDocuments(userAddress);

  if (chatId && addressInDB.length == 0) {
    Subscription.createSubscription(
      chatId,
      userAddress,
      unixTimestamp, //NFT received date
      statusObj.validThru,
      statusObj.status
    )
      .then((newSubscription) => {
        console.log("New subscription created:", newSubscription);
        // WRITE TELEGRAM MESSAGE BACK
        sendZeusInvite(chatId, bot);
      })
      .catch((error) => {
        console.error("Error creating subscription:", error);
      });
  } else if (addressInDB.length > 0) {
    if (
      addressInDB[0].status != statusObj.status ||
      addressInDB[0].validThru != statusObj.validThru
    ) {
      console.log("Need to update!!!!");
      if (addressInDB[0].status != statusObj.status) {
        if (
          addressInDB[0].status == "Expired" &&
          statusObj.status == "Active"
        ) {
          // WRITE TELEGRAM MESSAGE BACK
          sendZeusInvite(chatId, bot);
        }
        Subscription.updateDocument(userAddress, "status", statusObj.status)
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated Document:", updatedDocument);
            } else {
              console.log("Document not found.");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      } else {
        Subscription.updateDocument(
          userAddress,
          "validThru",
          statusObj.validThru
        )
          .then((updatedDocument) => {
            if (updatedDocument) {
              console.log("Updated Document:", updatedDocument);
            } else {
              console.log("Document not found.");
            }
          })
          .catch((error) => {
            console.error("Error updating document:", error);
          });
      }
    }
  }

  return returnObj;
}

async function getStatus(userAddress, mintUnixTimetamp, blockNum, price) {
  // NFT has not expired yet!
  const isLessThanDays = isLessThanDaysAgo(mintUnixTimetamp, DAYS_AGO);
  if (isLessThanDays) {
    return {
      status: "Active",
      validThru: unixTimestampInFuture(mintUnixTimetamp, DAYS_AGO),
    };
  }

  const config = {
    apiKey: process.env.ALCHEMY_TOKEN,
    network: NETWORK,
  };
  const alchemy = new Alchemy(config);
  const res = await alchemy.core.getAssetTransfers({
    fromBlock: blockNum,
    toAddress: REWARD_ADDRESS,
    fromAddress: userAddress,
    excludeZeroValue: true,
    category: ["external"],
  });

  const weiValue = ethers.utils.parseUnits(price.toString(), "wei");
  const etherValue = ethers.utils.formatEther(weiValue);

  let txns = res.transfers.filter(
    (txn) => txn.value >= etherValue && txn.asset === "ETH"
  );

  if (txns.length != 0) {
    const blockNumPayment = fromHex(txns[txns.length - 1].blockNum);

    const txnHash = txns[txns.length - 1].hash;

    const provider = new ethers.providers.AlchemyProvider(
      providerNetwork,
      process.env.ALCHEMY_TOKEN
    );
    const unixTimestampPayment = (await provider.getBlock(blockNumPayment))
      .timestamp; //UNIX!

    if (
      areTimestampsWithinDaysApart(
        Date.now() / 1000,
        unixTimestampPayment,
        DAYS_AGO
      )
    ) {
      let validThru = unixTimestampInFuture(unixTimestampPayment, DAYS_AGO);
      // validThru =
      //   unixToHumanDate(validThru);

      const lastPaymentObj = unixToHumanDate(unixTimestampPayment);
      const statusObj = {
        unixTimestampPayment: unixTimestampPayment,
        lastPaymentDateObj: lastPaymentObj,
        blockPayment: blockNumPayment,
        txnHash: txnHash,
        status: "Active",
        validThru: validThru,
        validThruHumanDate: unixToHumanDateTime(validThru),
      };
      return statusObj;
    } else {
      return {
        status: "Expired",
        validThru: unixTimestampInFuture(mintUnixTimetamp, DAYS_AGO),
      };
    }
  } else {
    return {
      status: "Expired",
      validThru: unixTimestampInFuture(mintUnixTimetamp, DAYS_AGO),
    };
  }
}

function unixToHumanDate(unixTimestamp) {
  const milliseconds = unixTimestamp * 1000; // Convert seconds to milliseconds
  const dateObject = new Date(milliseconds);

  const y = dateObject.getFullYear();
  const m = MONTHS[dateObject.getMonth()];

  const d = dateObject.getDate().toString();

  return {
    day: d,
    month: m,
    year: y,
  };
}

function unixToHumanDateTime(unixTimestamp) {
  const milliseconds = unixTimestamp * 1000; // Convert seconds to milliseconds
  const dateObject = new Date(milliseconds);

  const year = dateObject.getFullYear();
  const month = MONTHS[dateObject.getMonth()];

  const day = dateObject.getDate().toString();
  const hours = dateObject.getHours().toString().padStart(2, "0");
  const minutes = dateObject.getMinutes().toString().padStart(2, "0");
  const seconds = dateObject.getSeconds().toString().padStart(2, "0");

  const time = dateObject.toLocaleTimeString("en-US", { timeStyle: "short" });

  const formattedDateTime = `${month} ${day}, ${year} ${time}`;
  return formattedDateTime;
}

function isLessThanDaysAgo(unixTimestamp, daysAgo) {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp
  const secondsInADay = 24 * 60 * 60; // Number of seconds in a day

  return currentTimestamp - unixTimestamp < daysAgo * secondsInADay;
}

function areTimestampsWithinDaysApart(timestamp1, timestamp2, daysApart) {
  const secondsPerDay = 24 * 60 * 60; // Number of seconds in a day
  const timeDifference = Math.abs(timestamp1 - timestamp2);
  const daysDifference = timeDifference / secondsPerDay;
  return daysDifference <= Math.abs(daysApart);
}

function unixTimestampInFuture(baseTimestamp, daysInFuture) {
  const baseTimestampMilliseconds = baseTimestamp * 1000;
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsToAdd = daysInFuture * millisecondsInDay;
  const futureTimestampMilliseconds =
    baseTimestampMilliseconds + millisecondsToAdd;
  const futureTimestampSeconds = Math.floor(futureTimestampMilliseconds / 1000);
  return futureTimestampSeconds;
}

async function getDocuments(address) {
  try {
    const documents = await Subscription.findByAddress(address).exec();
    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}
