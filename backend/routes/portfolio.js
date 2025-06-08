import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import fetch from 'node-fetch';

const router = express.Router();
const SECRET = process.env.JWT_SECRET;
const CMC_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

// Middleware d’authentification
router.use((req, res, next) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ message: 'Non authentifié' });
  try {
    const { userId } = jwt.verify(auth, SECRET);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Récupérer le portefeuille
router.get('/', async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.portfolio);
});

// Ajouter une crypto
router.post('/add', async (req, res) => {
  const { symbol, amount, buyPrice } = req.body;
  const user = await User.findById(req.userId);
  user.portfolio.push({ symbol, amount, buyPrice });
  await user.save();
  res.json(user.portfolio);
});

// Actualiser les prix (regroupé)
router.get('/prices', async (req, res) => {
  const user = await User.findById(req.userId);
  const symbols = user.portfolio.map(c => c.symbol).join(',');
  const response = await fetch(`${CMC_URL}?symbol=${symbols}`, {
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY }
  });
  const data = await response.json();
  const prices = {};
  user.portfolio.forEach(c => {
    prices[c.symbol] = data.data[c.symbol]?.quote?.USD?.price || 0;
  });
  res.json(prices);
});

export default router;
