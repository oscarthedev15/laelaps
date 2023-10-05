import mongoose from "./db.js";
import Chat from "../models/chat.js";
import {getZuesMemberCount} from "./telegram.js"

export async function getActiveUsers() {
    const hunting = await getCountOfHuntingChats();
    const zeus = await getZuesMemberCount()

    return {
        "hunting" : hunting,
        "zeus" : zeus,
        "total" : zeus + hunting
    };
}

async function getCountOfHuntingChats() {
    try {
      const count = await Chat.countDocuments({ hunting: true });
      return count;
    } catch (error) {
      console.error('Error counting hunting chats:', error);
      throw error;
    }
  }