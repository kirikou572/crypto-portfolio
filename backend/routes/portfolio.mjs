import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import fetch from "node-fetch";

const router = express.Router();

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
}

// Fonction pour récupérer le prix d'une crypto
async function getCryptoPrice(ticker) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ticker.toLowerCase()}&vs_currencies=eur`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data[ticker.toLowerCase()]) throw new Error("Prix non trouvé");
  return data[ticker.toLowerCase()].eur;
}

// GET portefeuille
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const portfolioWithPrices = await Promise.all(user.portfolio.map(async (entry) => {
      const price = await getCryptoPrice(entry.ticker);
      return {
        ticker: entry.ticker,
        amount: entry.amount,
        price,
        total: entry.amount * price,
      };
    }));

    res.json({ portfolio: portfolioWithPrices });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST ajouter crypto
router.post("/", authenticateToken, async (req, res) => {
  const { ticker, amount } = req.body;
  if (!ticker || !amount) return res.status(400).json({ message: "Données manquantes" });

  try {
    const user = await User.findById(req.user.id);
    const existing = user.portfolio.find(entry => entry.ticker === ticker);

    if (existing) {
      existing.amount += amount;
    } else {
      user.portfolio.push({ ticker, amount });
    }

    await user.save();
    res.json({ message: "Ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// DELETE supprimer crypto
router.delete("/:ticker", authenticateToken, async (req, res) => {
  const { ticker } = req.params;
  try {
    const user = await User.findById(req.user.id);
    user.portfolio = user.portfolio.filter(entry => entry.ticker !== ticker);
    await user.save();
    res.json({ message: "Cryptomonnaie supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
