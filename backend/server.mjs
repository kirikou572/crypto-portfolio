// 1. Charger dotenv avant tout
import dotenv from 'dotenv';
dotenv.config();

// 2. Importer les autres modules et routes
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);

// Sert les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
