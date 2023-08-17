import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const chatSchema = new Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    tier: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bot: {
      type: String,
      required: true,
    },
    walletThreshold: {
      type: Number,
      default: 10000,
      required: true,
    },
    mcapThreshold: {
      type: Number,
      default: 1000000,
      required: true,
    },
    hunting: {
      type: Boolean,
      default: false,
      required: true,
    },
    tracking: {
      type: Boolean,
      default: false,
      required: true,
    },
    filters: {
      type: Object,
      required: true,
      default: {
        burn: false,
        locked: false,
        renounced: false,
        notax: false,
        new: false,
        honeypot: false,
        sus: false,
        strict: false,
        verified: false,
        unique: false,
        socials: false,
        contract: false,
        lp: false,
      },
    },
    blacklisted: {
      type: Object,
      required: true,
      default: { ca: [], wallet: [], keyword: [], deployer: [], checksum: [] },
    },
    favorites: {
      type: Object,
      required: true,
      default: Object,
    },
    fundingSourceSelected: {
      type: Array,
      required: true,
      default: ["all"],
    },
    presetFilter: {
      type: Array,
      required: true,
      default: [],
    },
    deactivated: {
      type: Boolean,
      default: false,
      required: true,
    },
    calledCA: {
      type: Array(),
      required: true,
      default: [],
    },
    skull: {
      type: Object(),
      required: true,
      default: { isSkull: false, bot: "", preset: "", calledCA: [] },
    },
  },
  {
    statics: {
      findByChatId(chatId) {
        return this.find({ chatId: chatId });
      },
      findByAddress(address) {
        return this.find({ address: address });
      },
      findByBot(bot) {
        return this.find({ bot: bot });
      },
      findByHunting(hunting) {
        return this.find({ hunting: hunting });
      },
    },
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);

export default Chat;

