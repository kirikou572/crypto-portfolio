// src/components/AddCryptoForm.jsx
import React, { useState } from 'react';

function AddCryptoForm({ onAdd }) {
  const [ticker, setTicker] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticker || !amount) return;
    onAdd(ticker.toUpperCase(), parseFloat(amount));
    setTicker('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
      <input
        className="border rounded px-4 py-2"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Ticker (e.g. BTC)"
      />
      <input
        type="number"
        className="border rounded px-4 py-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Quantité"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Ajouter
      </button>
    </form>
  );
}

export default AddCryptoForm;
