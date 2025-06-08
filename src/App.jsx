import React, { useEffect, useState } from "react";
import AddCryptoForm from "./components/AddCryptoForm";
import PortfolioTable from "./components/PortfolioTable";
import CurrencyToggle from "./components/CurrencyToggle";
import PortfolioChart from "./components/PortfolioChart";

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [currency, setCurrency] = useState("€");
  const [rate, setRate] = useState(1);

  const token = "demo"; // Simulé

  useEffect(() => {
    fetch("/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPortfolio(data.portfolio || []));
  }, []);

  const addCrypto = async (ticker, amount) => {
    const res = await fetch("/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ticker, amount }),
    });

    if (res.ok) {
      const { data } = await res.json();
      setPortfolio((prev) => [...prev, data]);
    }
  };

  const deleteCrypto = async (ticker) => {
    await fetch(`/portfolio/${ticker}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPortfolio((prev) => prev.filter((c) => c.ticker !== ticker));
  };

  const toggleCurrency = () => {
    if (currency === "€") {
      setCurrency("$");
      setRate(1.1); // Exemple taux fictif
    } else {
      setCurrency("€");
      setRate(1);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Portefeuille Crypto</h1>
      <CurrencyToggle currency={currency} onToggle={toggleCurrency} />
      <AddCryptoForm onAddCrypto={addCrypto} />
      <PortfolioTable
        portfolio={portfolio}
        onDelete={deleteCrypto}
        currency={currency}
        rate={rate}
      />
      <PortfolioChart data={portfolio.map((c) => ({ ...c, total: c.total * rate }))} />
    </div>
  );
}

export default App;
