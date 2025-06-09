import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import portfolioRoutes from "./routes/portfolio.mjs";
import authRoutes from "./routes/auth.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

app.use("/auth", authRoutes);
app.use("/portfolio", portfolioRoutes);

app.get("/", (req, res) => {
  res.send("✅ Serveur backend en ligne");
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
