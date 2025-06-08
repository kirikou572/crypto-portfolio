import express from 'express';
const router = express.Router();

// Exemple de route d'authentification
router.post('/login', (req, res) => {
  // Logique de connexion ici
  res.json({ message: 'Connexion réussie' });
});

router.post('/signup', (req, res) => {
  // Logique d'inscription ici
  res.json({ message: 'Inscription réussie' });
});

export default router;  // Export par défaut du router
