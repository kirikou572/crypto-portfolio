import express from "express";
import CoinMarketCapAPI from "../services/coinmarketcap.js";
import Portfolio from "../models/Portfolio.mjs"; // <-- Modèle MongoDB

const router = express.Router();
const coinMarketCap = new CoinMarketCapAPI();

router.post("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  const userId = token; // En prod : décoder un vrai JWT
  const { ticker, amount } = req.body;

  if (!ticker || !amount) {
    return res.status(400).json({ message: "Ticker ou quantité manquant" });
  }

  try {
    const price = await coinMarketCap.getPrice(ticker);
    const total = price * amount;

    await Portfolio.create({
      userId,
      ticker,
      amount,
      price,
      total,
    });

    res.json({ message: "Crypto ajoutée avec succès" });
  } catch (err) {
    console.error("Erreur ajout portefeuille :", err);
    res.status(500).json({ message: "Erreur serveur ou ticker invalide" });
  }
});

router.get("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  const userId = token;

  try {
    const portfolio = await Portfolio.find({ userId });
    res.json({ portfolio });
  } catch (err) {
    console.error("Erreur lecture portefeuille :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
