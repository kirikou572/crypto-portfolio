import mongoose from "mongoose";

const portfolioItemSchema = new mongoose.Schema({
  ticker: String,
  amount: Number,
  price: Number
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  portfolio: [portfolioItemSchema]
});

export default mongoose.model("User", userSchema);
