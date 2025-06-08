// server.mjs

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connexion à MongoDB
await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

// Middleware CORS : autoriser uniquement le frontend GitHub Pages
app.use(cors({
  origin: 'https://kirikou572.github.io'
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);

// Sert les fichiers statiques (si tu as un frontend dans le dossier ../frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
