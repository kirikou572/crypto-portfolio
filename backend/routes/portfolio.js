import express from 'express';
import { getCryptoPrice } from '../services/coinmarketcap.mjs';

const router = express.Router();

// Stockage temporaire en mémoire
const userPortfolios = {};

// Middleware d'authentification simulée
function fakeAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  req.user = { id: token }; // Le token est utilisé comme ID utilisateur
  next();
}

router.use(fakeAuth);

// GET /portfolio — récupère les cryptos de l'utilisateur
router.get('/', (req, res) => {
  const portfolio = userPortfolios[req.user.id] || [];
  res.json({ portfolio });
});

// POST /portfolio — ajoute une crypto avec son prix
router.post('/', async (req, res) => {
  const { ticker, amount } = req.body;

  if (!ticker || !amount) {
    return res.status(400).json({ message: 'Ticker et quantité requis' });
  }

  try {
    const price = await getCryptoPrice(ticker.toUpperCase());

    if (!price) {
      return res.status(404).json({ message: "Cryptomonnaie non trouvée" });
    }

    const newCrypto = {
      ticker: ticker.toUpperCase(),
      amount,
      price,
      total: amount * price
    };

    if (!userPortfolios[req.user.id]) {
      userPortfolios[req.user.id] = [];
    }

    userPortfolios[req.user.id].push(newCrypto);

    res.status(201).json({
      message: 'Crypto ajoutée avec succès',
      data: newCrypto
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Erreur lors de l’appel à CoinMarketCap',
      error: err.message
    });
  }
});

export default router;
