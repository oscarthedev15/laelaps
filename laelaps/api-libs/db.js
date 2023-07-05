import mongoose from "mongoose";

mongoose.set("strictQuery", true);
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

export default mongoose;
