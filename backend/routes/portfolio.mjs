import express from 'express';
import authenticateToken from '../middleware/authenticate.mjs';
import User from '../models/User.mjs';
import fetch from 'node-fetch';

const router = express.Router();

// 📌 Helper : récupération du taux de change EUR <-> USD
async function getExchangeRate(toCurrency = 'eur') {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=EUR');
    const data = await res.json();
    const rate = data.rates[toCurrency.toUpperCase()];
    return rate || 1; // 1 si non trouvé
  } catch {
    return null;
  }
}

// 🔍 Récupérer le portefeuille
router.get('/', authenticateToken, async (req, res) => {
  const currency = req.query.currency || 'eur';
  const rate = await getExchangeRate(currency);
  if (!rate) return res.status(500).json({ message: 'Impossible de récupérer le taux de change' });

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const portfolio = user.portfolio.map(item => {
      const total = item.amount * item.price * rate;
      return {
        ...item.toObject(),
        price: item.price * rate,
        total
      };
    });

    const global = portfolio.reduce((acc, val) => acc + val.total, 0);

    res.json({ portfolio, totalValue: global });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ➕ Ajouter une crypto
router.post('/', authenticateToken, async (req, res) => {
  const { ticker, amount } = req.body;

  try {
    const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ticker.toLowerCase()}&vs_currencies=eur`);
    const priceData = await priceRes.json();
    const price = priceData[ticker.toLowerCase()]?.eur;

    if (!price) return res.status(400).json({ message: "Cryptomonnaie non reconnue" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    user.portfolio.push({ ticker, amount, price });
    await user.save();
    res.json({ message: 'Crypto ajoutée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ❌ Supprimer une crypto (par ticker)
router.delete('/:ticker', authenticateToken, async (req, res) => {
  const tickerToRemove = req.params.ticker.toUpperCase();

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    user.portfolio = user.portfolio.filter(item => item.ticker.toUpperCase() !== tickerToRemove);
    await user.save();
    res.json({ message: 'Crypto supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
