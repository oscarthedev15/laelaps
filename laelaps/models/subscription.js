import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const subscriptionSchema = new Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.statics = {
  findByChatId(chatId) {
    return this.find({ chatId: chatId });
  },
  findByAddress(address) {
    return this.find({ address: address });
  },
  findByStatus(status) {
    return this.find({ status: status });
  },
  createSubscription(chatId, address, date, status) {
    const newSubscription = new this({
      chatId: chatId,
      address: address,
      date: date,
      status: status,
    });
    return newSubscription.save();
  },
  updateDocument(address, newStatus) {
    return this.findOneAndUpdate(
      { address: address },
      { $set: { status: newStatus } },
      { new: true }
    );
  },
  
};

const Subscription = model("Subscription", subscriptionSchema);

export default Subscription;
