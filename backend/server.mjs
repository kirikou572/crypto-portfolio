import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import portfolioRoutes from "./routes/portfolio.mjs";
import authRoutes from "./routes/auth.mjs"; // <-- Ajouté

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

// Routes
app.use("/portfolio", portfolioRoutes);
app.use("/auth", authRoutes); // <-- Ajouté

// Route de test
app.get("/", (req, res) => {
  res.send("✅ Serveur backend en ligne");
});

// Démarrage
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
