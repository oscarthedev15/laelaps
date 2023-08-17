import { Telegraf } from "telegraf";
import { ethers } from "ethers";
import contractAbi20 from "../contracts/LaelapsToken.json";
import contractAbi721 from "../contracts/MasterKey.json";
import contractAbi721A from "../contracts/masterKeyv2.json";
import contractAbi1155 from "../contracts/Skull.json";

import Chat from "../models/chat.js";
import mongoose from "./db.js";

const laelapsCA = "0x6C059413686565D5aD6cce6EED7742c42DbC44CA";
const laelapsKeysCA = "0x691c77F69a6AE05F5C8cC9f46d7E46Ce97FA2F3B";
const laelapsKeyv2 = "0x992d6fbe83f3f4c938f687a6676a1155a523a20b";
const skullCA = "0xd8abb74b79e534d903a821e59d1b06ca04c6af40";
const tier3 = 5000000;

const bot = new Telegraf(process.env.BOT_TOKEN);
const bot1 = new Telegraf(process.env.BOT1_TOKEN);
const bot2 = new Telegraf(process.env.BOT2_TOKEN);
const bot3 = new Telegraf(process.env.BOT3_TOKEN);
const bot4 = new Telegraf(process.env.BOT4_TOKEN);
const bot5 = new Telegraf(process.env.BOT5_TOKEN);
const bot6 = new Telegraf(process.env.BOT6_TOKEN);
const bot7 = new Telegraf(process.env.BOT7_TOKEN);
const bot8 = new Telegraf(process.env.BOT8_TOKEN);
const bot9 = new Telegraf(process.env.BOT9_TOKEN);
const bot10 = new Telegraf(process.env.BOT10_TOKEN);
const bot11 = new Telegraf(process.env.BOT11_TOKEN);
const bot12 = new Telegraf(process.env.BOT12_TOKEN);
const bot13 = new Telegraf(process.env.BOT13_TOKEN);

const noBot = {
  1: bot,
  2: bot1,
  3: bot2,
  4: bot3,
  5: bot4,
  6: bot5,
  7: bot6,
  8: bot7,
  9: bot8,
  10: bot9,
  11: bot10,
  12: bot11,
  13: bot12,
  14: bot13,
};

export async function validateAccount(address, bot, chatId) {
  const balances = await getBalances(address);
  return balances
  var chat = (await Chat.findByChatId(chatId))[0];
  var chatConnectedToAddress = (await Chat.findByAddress(address))[0];
  let activeBot = noBot[bot];
  if (chat && !chat.deactivated) {
    await activeBot.telegram.sendMessage(
      chatId,
      `This chat has already been validated. Use command /hunt to get started.`
    );
    return balances;
  }

  if (chatConnectedToAddress && !chatConnectedToAddress.deactivated) {
    await activeBot.telegram.sendMessage(
      chatId,
      `This Wallet has already been activated. Try another one.`
    );
    return balances;
  }

  if (bot && chatId) {
    let activeBot = noBot[bot];
    if (balances.laelaps < tier3 && balances.masterKey < 1) {
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

  //LAELAPS BALANCE
  const laelapsContract = new ethers.Contract(
    laelapsCA,
    contractAbi20,
    provider
  );
  const laelapsBalance = await laelapsContract.balanceOf(address);
  balances["laelaps"] = Number(
    ethers.utils.formatUnits(laelapsBalance, 18)
  ).toFixed(4);

  //MASTER KEY V1 BALANCE

  const masterKeyContract = new ethers.Contract(
    laelapsKeysCA,
    contractAbi721,
    provider
  );
  const masterKeyBalance = await masterKeyContract.balanceOf(address);
  balances["masterKey"] = masterKeyBalance.toNumber();

  //MASTER KEY V2 BALANCE

  const masterKeyContractv2 = new ethers.Contract(
    laelapsKeyv2,
    contractAbi721A,
    provider
  );

  const masterKeyBalancev2 = await masterKeyContractv2.balanceOf(address);
  balances["masterKey"] += masterKeyBalancev2.toNumber();

  //SKULL KEY BALANCE

  const skullContract = new ethers.Contract(
    skullCA,
    contractAbi1155,
    provider
  );

  const skullBalance = await skullContract.balanceOf(address, 0);
  balances["skull"] = skullBalance.toNumber();

  return balances;
} 
