import express from "express";
import Portfolio from "../models/PortfolioItem.mjs";
import authMiddleware from "../middleware/auth.mjs";
import fetch from "node-fetch";

const router = express.Router();

const CMC_API_KEY = process.env.CMC_API_KEY;

if (!CMC_API_KEY) {
  console.error("❌ Clé API CoinMarketCap non définie dans .env");
}

// Fonction pour récupérer le prix d’une crypto en EUR via CoinMarketCap
async function getCryptoPrice(ticker) {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${ticker}&convert=EUR`;

  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": CMC_API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erreur API CoinMarketCap:", response.status, text);
    throw new Error(`Erreur API CoinMarketCap: ${response.status}`);
  }

  const data = await response.json();

  console.log("Réponse API CoinMarketCap:", JSON.stringify(data, null, 2));

  if (!data.data || !data.data[ticker] || !data.data[ticker].quote.EUR.price) {
    throw new Error("Prix introuvable pour la crypto " + ticker);
  }

  return data.data[ticker].quote.EUR.price;
}

// GET /portfolio - Récupérer le portfolio de l'utilisateur connecté
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    let portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      // Portfolio non trouvé, on renvoie un tableau vide
      return res.json({ portfolio: [] });
    }

    // Pour chaque crypto, récupérer le prix actuel et calculer total
    const portfolioWithPrices = [];

    for (const crypto of portfolio.cryptos) {
      try {
        const price = await getCryptoPrice(crypto.ticker.toUpperCase());
        portfolioWithPrices.push({
          ticker: crypto.ticker,
          amount: crypto.amount,
          price,
          total: price * crypto.amount,
        });
      } catch (err) {
        console.error(`Erreur pour ${crypto.ticker}:`, err.message);
        // On peut choisir d'ignorer ou renvoyer une erreur ici.
        // Ici, on renvoie avec prix et total à 0
        portfolioWithPrices.push({
          ticker: crypto.ticker,
          amount: crypto.amount,
          price: 0,
          total: 0,
        });
      }
    }

    res.json({ portfolio: portfolioWithPrices });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /portfolio - Ajouter ou mettre à jour une crypto dans le portfolio
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { ticker, amount } = req.body;

  if (!ticker || !amount || amount <= 0) {
    return res.status(400).json({ message: "Ticker et quantité valides requis" });
  }

  try {
    let portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      // Création d'un nouveau portfolio si inexistant
      portfolio = new Portfolio({
        user: userId,
        cryptos: [{ ticker: ticker.toUpperCase(), amount }],
      });
    } else {
      // Vérifier si la crypto existe déjà
      const index = portfolio.cryptos.findIndex(
        (c) => c.ticker.toUpperCase() === ticker.toUpperCase()
      );

      if (index !== -1) {
        // Mise à jour de la quantité
        portfolio.cryptos[index].amount += amount;
      } else {
        // Ajout de la nouvelle crypto
        portfolio.cryptos.push({ ticker: ticker.toUpperCase(), amount });
      }
    }

    await portfolio.save();

    res.json({ message: "Cryptomonnaie ajoutée/modifiée avec succès" });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /portfolio/:ticker - Supprimer une crypto du portfolio
router.delete("/:ticker", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const ticker = req.params.ticker.toUpperCase();

  try {
    let portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio introuvable" });
    }

    portfolio.cryptos = portfolio.cryptos.filter(
      (c) => c.ticker.toUpperCase() !== ticker
    );

    await portfolio.save();

    res.json({ message: "Cryptomonnaie supprimée avec succès" });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
