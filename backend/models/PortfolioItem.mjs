import mongoose from "mongoose";

const cryptoSchema = new mongoose.Schema({
  ticker: { type: String, required: true, uppercase: true, trim: true },
  amount: { type: Number, required: true },
});

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cryptos: [cryptoSchema],
}, { timestamps: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
