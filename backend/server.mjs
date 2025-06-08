import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connecté');

    const app = express();

    app.use(express.json());
    app.use('/auth', authRoutes);
    app.use('/portfolio', portfolioRoutes);

    // Fichiers statiques frontend
    app.use(express.static(path.join(__dirname, '../frontend')));

    const PORT = process.env.PORT || 3000;
    console.log(`🔌 Port utilisé : ${PORT}`);

    app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB :', error);
    process.exit(1);
  }
}

startServer();
