import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {
  // Logique d'authentification ici
  res.json({ message: 'Connexion réussie' });
});

router.post('/signup', (req, res) => {
  // Logique d'inscription ici
  res.json({ message: 'Inscription réussie' });
});

export default router;
