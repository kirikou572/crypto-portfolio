import React, { useState } from "react";

function AddCryptoForm({ onAddCrypto }) {
  const [ticker, setTicker] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticker || !amount) return;

    onAddCrypto(ticker.trim(), parseFloat(amount));
    setTicker("");
    setAmount("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-6 items-end flex-wrap"
    >
      <div>
        <label className="block text-sm font-medium">Ticker</label>
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Ex: BTC"
          className="border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Quantité</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ex: 0.5"
          className="border rounded px-2 py-1"
          min="0"
          step="any"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter
      </button>
    </form>
  );
}

export default AddCryptoForm;
