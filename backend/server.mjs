import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import portfolioRoutes from "./routes/portfolio.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS sécurisé
app.use(cors({
  origin: "https://kirikou572.github.io",
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connecté"))
.catch((err) => console.error("❌ Erreur connexion MongoDB :", err));

app.use("/portfolio", portfolioRoutes);

app.get("/", (req, res) => {
  res.send("✅ Serveur backend en ligne");
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
