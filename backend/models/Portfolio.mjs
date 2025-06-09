import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ticker: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
