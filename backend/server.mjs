import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.mjs";
import portfolioRoutes from "./routes/portfolio.mjs";
import authMiddleware from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connecté"))
.catch((err) => console.error("❌ Erreur connexion MongoDB :", err));

// Routes publiques
app.use("/auth", authRoutes);

// Routes sécurisées (nécessitent authentification)
app.use("/portfolio", authMiddleware, portfolioRoutes);

// Route de test simple
app.get("/", (req, res) => {
  res.send("✅ Serveur backend en ligne");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
