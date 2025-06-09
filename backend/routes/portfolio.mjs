import express from "express";
import Portfolio from "../models/Portfolio.js";
import getCryptoPrice from "../services/coinmarketcap.js"; // service pour récupérer prix
const router = express.Router();

// Récupérer le portfolio de l'utilisateur avec prix à jour
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) return res.status(404).json({ message: "Portfolio introuvable" });

    // Pour chaque crypto, récupérer le prix en EUR et calculer total
    const portfolioWithPrices = await Promise.all(
      portfolio.cryptos.map(async (item) => {
        const price = await getCryptoPrice(item.ticker);
        return {
          ticker: item.ticker,
          amount: item.amount,
          price,
          total: item.amount * price,
        };
      })
    );

    res.json({ portfolio: portfolioWithPrices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajouter une crypto au portfolio ou mettre à jour la quantité
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { ticker, amount } = req.body;
    if (!ticker || !amount) return res.status(400).json({ message: "Ticker et quantité requis" });

    // Valider que la crypto existe via l'API
    try {
      await getCryptoPrice(ticker.toUpperCase());
    } catch {
      return res.status(400).json({ message: "Cryptomonnaie non reconnue" });
    }

    let portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      // Créer un nouveau portfolio si inexistant
      portfolio = new Portfolio({ user: userId, cryptos: [{ ticker: ticker.toUpperCase(), amount }] });
    } else {
      // Mettre à jour la crypto existante ou ajouter
      const cryptoIndex = portfolio.cryptos.findIndex(c => c.ticker === ticker.toUpperCase());
      if (cryptoIndex > -1) {
        portfolio.cryptos[cryptoIndex].amount += amount;
      } else {
        portfolio.cryptos.push({ ticker: ticker.toUpperCase(), amount });
      }
    }

    await portfolio.save();
    res.json({ message: "Cryptomonnaie ajoutée/modifiée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une crypto du portfolio
router.delete("/:ticker", async (req, res) => {
  try {
    const userId = req.user.id;
    const ticker = req.params.ticker.toUpperCase();

    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) return res.status(404).json({ message: "Portfolio introuvable" });

    portfolio.cryptos = portfolio.cryptos.filter(c => c.ticker !== ticker);
    await portfolio.save();

    res.json({ message: `Cryptomonnaie ${ticker} supprimée` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
