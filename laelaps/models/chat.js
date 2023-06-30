const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

// {
//     chatId: 5918569229,
//     tier: 3,
//     address: '0x7101064F2f57C79054ECA0034fC544E9e8DF7c5f',
//     bot: '4',
//     walletThreshold: 5000,
//     mcapThreshold: 1000000,
//     hunting: true,
//     filters: {
//       burn: false,
//       locked: false,
//       renounced: false,
//       notax: false,
//       new: false,
//       honeypot: false,
//       'min-wallet': 5000
//     },
//     blacklisted: { ca: [], wallet: [], keyword: [], deployer: [], c },
//     favorites: {}
//   }
