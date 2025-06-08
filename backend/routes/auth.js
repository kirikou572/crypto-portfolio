import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// ... tes routes signup/login ici

// Inscription
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, passwordHash: password });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    res.status(400).json({ message: 'Email déjà utilisé' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
  const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '12h' });
  res.json({ token, email: user.email });
});

export default router;
