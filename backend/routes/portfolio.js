import express from 'express';
const router = express.Router();

// Stockage temporaire (à remplacer par une vraie DB plus tard)
const userPortfolios = {}; // clé = userId ou token simulé, valeur = tableau de cryptos

// Middleware d’authentification simplifiée (peut être remplacé par un vrai middleware JWT)
function fakeAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  req.user = { id: token }; // Simulation : on utilise le token comme userId
  next();
}

router.use(fakeAuth);

// GET /portfolio
router.get('/', (req, res) => {
  const portfolio = userPortfolios[req.user.id] || [];
  res.json({ portfolio });
});

// POST /portfolio
router.post('/', (req, res) => {
  const { ticker, amount } = req.body;
  if (!ticker || !amount) {
    return res.status(400).json({ message: 'Ticker et quantité requis' });
  }

  if (!userPortfolios[req.user.id]) {
    userPortfolios[req.user.id] = [];
  }

  userPortfolios[req.user.id].push({ ticker, amount });
  res.status(201).json({ message: 'Crypto ajoutée avec succès' });
});

export default router;
