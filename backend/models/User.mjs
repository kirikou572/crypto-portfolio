import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  portfolio: [
    {
      ticker: String,
      amount: Number,
    },
  ],
});

export default mongoose.model("User", userSchema);
