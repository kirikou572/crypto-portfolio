import express from 'express';
import fetch from 'node-fetch';
import PortfolioItem from '../models/PortfolioItem.mjs'; // modèle mongoose, à adapter si besoin
import authMiddleware from '../middleware/auth.mjs'; // middleware d’authentification JWT

const router = express.Router();
const CMC_API_KEY = process.env.CMC_API_KEY;

async function getCryptoPriceCMC(ticker) {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${ticker}`;

  const response = await fetch(url, {
    headers: {
      'X-CMC_PRO_API_KEY': CMC_API_KEY,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erreur API CoinMarketCap');
  }

  const data = await response.json();

  if (!data.data || !data.data[ticker] || !data.data[ticker].quote || !data.data[ticker].quote.EUR) {
    throw new Error('Cryptomonnaie non reconnue');
  }

  return data.data[ticker].quote.EUR.price;
}

// Récupérer le portfolio de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  try {
    const portfolio = await PortfolioItem.find({ userId: req.user.id });
    res.json({ portfolio });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter une cryptomonnaie
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { ticker, amount } = req.body;
    if (!ticker || !amount) {
      return res.status(400).json({ message: 'Ticker et quantité requis' });
    }

    const price = await getCryptoPriceCMC(ticker.toUpperCase());

    // Vérifier si crypto existe déjà dans le portfolio de l’utilisateur
    let item = await PortfolioItem.findOne({ userId: req.user.id, ticker: ticker.toUpperCase() });

    if (item) {
      // Mise à jour quantité et total
      item.amount += amount;
      item.price = price;
      item.total = item.amount * price;
    } else {
      item = new PortfolioItem({
        userId: req.user.id,
        ticker: ticker.toUpperCase(),
        amount,
        price,
        total: amount * price,
      });
    }

    await item.save();

    res.json({ message: 'Cryptomonnaie ajoutée avec succès', portfolioItem: item });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer une crypto du portfolio
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await PortfolioItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item non trouvé' });
    res.json({ message: 'Cryptomonnaie supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
