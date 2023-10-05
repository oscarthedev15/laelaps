

import { Telegraf } from "telegraf";
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


export async function sendZeusInvite(chatid, bot) {
    const zeusId = -1001987532423
        // ctx.answerCbQuery();
        // const chatId = ctx.match[0].split("-")[1];
        // var bot = noBot[ctx.match[0].split("-")[2]];
        var zeusBot = noBot[1]
        try{
            var link = (await zeusBot.telegram.createChatInviteLink(zeusId, {member_limit: 1, expire_date: Date.now()+60000}))
        }catch(err){
            console.log(err)
            return;
        }
        console.log(link)
        await zeusBot.telegram.sendMessage(chatid, `Your unique zeus invite link is ${link.invite_link}`)

}

export async function getZuesMemberCount() {
    const zeusId = -1001987532423
    let chatBot = noBot[1];
    const totalMembers = await chatBot.telegram.getChatMembersCount(zeusId)
    return totalMembers;
}
