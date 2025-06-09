import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticker: { type: String, required: true, uppercase: true, trim: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true }, // Prix unitaire en EUR au moment de l'ajout
  total: { type: Number, required: true }  // amount * price
}, {
  timestamps: true
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);

export default PortfolioItem;
