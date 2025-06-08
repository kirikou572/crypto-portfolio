import express from 'express';
import { getCryptoPrice } from '../services/coinmarketcap.mjs';
import Portfolio from '../models/Portfolio.mjs'; // <-- modèle Mongoose

const router = express.Router();

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

// GET /portfolio — récupère les cryptos de l'utilisateur depuis MongoDB
router.get('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user.id });
    res.json({ portfolio });
  } catch (err) {
    console.error("Erreur lecture portefeuille :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /portfolio — ajoute une crypto avec son prix dans MongoDB
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

    const newCrypto = new Portfolio({
      userId: req.user.id,
      ticker: ticker.toUpperCase(),
      amount,
      price,
      total: amount * price
    });

    await newCrypto.save();

    res.status(201).json({
      message: 'Crypto ajoutée avec succès',
      data: newCrypto
    });
  } catch (err) {
    console.error("Erreur ajout crypto :", err);
    res.status(500).json({
      message: 'Erreur lors de l’appel à CoinMarketCap ou MongoDB',
      error: err.message
    });
  }
});

// DELETE /portfolio/:ticker — supprime toutes les entrées pour un ticker
router.delete('/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();

  try {
    const result = await Portfolio.deleteMany({
      userId: req.user.id,
      ticker
    });

    res.json({
      message: `Crypto supprimée (${ticker})`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Erreur suppression crypto :", err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
});

export default router;
