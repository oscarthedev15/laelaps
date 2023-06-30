import { Telegraf } from "telegraf";
import { ethers } from "ethers";
import contractAbi20 from "../contracts/LaelapsToken.json";
import contractAbi721 from "../contracts/MasterKey.json";
import mongoose from "mongoose";
import Chat from "../models/chat.js";

mongoose.set("strictQuery", true);
//mongoose.set('debug', true)
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err.message, "err connecting to db");
  });

const laelapsCA = "0x6C059413686565D5aD6cce6EED7742c42DbC44CA";
const laelapsKeysCA = "0x691c77F69a6AE05F5C8cC9f46d7E46Ce97FA2F3B";

const tier3 = 0.5;

const bot = new Telegraf(process.env.BOT_TOKEN);
const bot1 = new Telegraf(process.env.BOT1_TOKEN);
const bot2 = new Telegraf(process.env.BOT2_TOKEN);
const bot3 = new Telegraf(process.env.BOT3_TOKEN);
const bot4 = new Telegraf(process.env.BOT4_TOKEN);
const bot5 = new Telegraf(process.env.BOT5_TOKEN);
const bot6 = new Telegraf(process.env.BOT6_TOKEN);

const noBot = {
  1: bot,
  2: bot1,
  3: bot2,
  4: bot3,
  5: bot4,
  6: bot5,
  7: bot6,
};

export async function validateAccount(address, bot, chatId) {
  const balances = await getBalances(address);
  if (bot && chatId) {
    let activeBot = noBot[bot];
    if (balances.laelaps < 5000000 && balances.masterKey < 1) {
      await activeBot.telegram.sendMessage(
        chatId,
        `Wallet doesn't hold enough tokens.`
      );
      return balances;
    } else {
      await activeBot.telegram.sendMessage(
        chatId,
        `Account has been activated. Use /hunt to get started`
      );
      let chat = new Chat({
        chatId: chatId,
        tier: 3,
        address: address,
        bot: bot,
      });
      await chat
        .save()
        .then((result) => {})
        .catch((err) => {
          console.log(err);
        });
      return balances;
    }
  } else {
    return balances;
  }
}

export async function getBalances(address) {
  const balances = {};
  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${process.env.INFURA}`
  );
  const laelapsContract = new ethers.Contract(
    laelapsCA,
    contractAbi20,
    provider
  );
  const laelapsBalance = await laelapsContract.balanceOf(address);
  balances["laelaps"] = ethers.utils.formatEther(laelapsBalance);

  const masterKeyContract = new ethers.Contract(
    laelapsKeysCA,
    contractAbi721,
    provider
  );
  const masterKeyBalance = await masterKeyContract.balanceOf(address);
  balances["masterKey"] = masterKeyBalance.toNumber();

  return balances;
}
