// 1. Charger dotenv avant tout
import dotenv from 'dotenv';
dotenv.config();

// 2. Importer les autres modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';

// 3. Initialisation des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 4. Connexion à MongoDB
await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log('✅ MongoDB connecté');

// 5. Initialisation express
const app = express();

// 6. Middleware CORS (autorise GitHub Pages à appeler l’API)
app.use(cors({
  origin: 'https://kirikou572.github.io' // Frontend GitHub Pages
}));

app.use(express.json());

// 7. Routes
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);

// 8. Lancement du serveur
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🔌 Port utilisé : ${PORT}`);
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});
