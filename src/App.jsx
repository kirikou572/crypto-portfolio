import React, { useEffect, useState } from "react";
import PortfolioTable from "./components/PortfolioTable";
import AddCryptoForm from "./components/AddCryptoForm";
import axios from "axios";

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [currency, setCurrency] = useState("EUR"); // EUR ou USD
  const [exchangeRate, setExchangeRate] = useState(1.08); // 1 EUR = 1.08 USD par défaut

  const token = "demoUser"; // auth simulée

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get("http://localhost:3000/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(res.data.portfolio);
    } catch (err) {
      console.error("Erreur chargement portefeuille :", err);
    }
  };

  const handleAddCrypto = async (ticker, amount) => {
    try {
      await axios.post(
        "http://localhost:3000/portfolio",
        { ticker, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPortfolio(); // refresh
    } catch (err) {
      console.error("Erreur ajout crypto :", err);
    }
  };

  const handleDeleteCrypto = async (ticker) => {
    try {
      await axios.delete(`http://localhost:3000/portfolio/${ticker}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPortfolio();
    } catch (err) {
      console.error("Erreur suppression crypto :", err);
    }
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "EUR" ? "USD" : "EUR"));
  };

  const convertPrice = (value) => {
    return currency === "USD" ? value * exchangeRate : value;
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="p-4 font-sans max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mon Portefeuille Crypto</h1>
        <button
          onClick={toggleCurrency}
          className="border px-3 py-1 text-sm rounded hover:bg-gray-100"
        >
          Afficher en {currency === "EUR" ? "USD ($)" : "EUR (€)"}
        </button>
      </div>

      <AddCryptoForm onAddCrypto={handleAddCrypto} />

      <PortfolioTable
        portfolio={portfolio}
        onDeleteCrypto={handleDeleteCrypto}
        convertPrice={convertPrice}
        currency={currency}
      />
    </div>
  );
}

export default App;
