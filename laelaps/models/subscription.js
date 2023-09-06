import { Schema as _Schema, model, mongoose } from "mongoose";
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
    validThru: {
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
  createSubscription(chatId, address, date, validThru, status) {
    const newSubscription = new this({
      chatId: chatId,
      address: address,
      date: date,
      validThru: validThru,
      status: status,
    });
    return newSubscription.save();
  },
  async updateDocument(address, fieldToUpdate, newValue) {
    const updateQuery = { [fieldToUpdate]: newValue };
    const updatedDocument = await this.findOneAndUpdate(
      { address: address },
      { $set: updateQuery },
      { new: true }
    );
    return updatedDocument;
  },
  
};

const Subscription = mongoose.models.Subscription || model("Subscription", subscriptionSchema) ;

export default Subscription;
