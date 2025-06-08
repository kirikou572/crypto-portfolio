import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  // Logique pour récupérer les données du portfolio ici
  res.json({ portfolio: [] });
});

export default router;
