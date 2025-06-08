// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import AddCryptoForm from './AddCryptoForm.jsx';
import PortfolioTable from './PortfolioTable.jsx';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ currency, toggleCurrency }) {
  const [portfolio, setPortfolio] = useState([]);
  const [token] = useState('demo-user'); // replace with real token logic

  const fetchPortfolio = async () => {
    const res = await fetch('/portfolio', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPortfolio(data.portfolio);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAdd = async (ticker, amount) => {
    await fetch('/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ticker, amount }),
    });
    fetchPortfolio();
  };

  const handleDelete = async (ticker) => {
    await fetch(`/portfolio/${ticker}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchPortfolio();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mon Portefeuille Crypto</h1>
        <button
          onClick={toggleCurrency}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Convertir en {currency === 'USD' ? 'EUR' : 'USD'}
        </button>
      </div>
      <AddCryptoForm onAdd={handleAdd} />
      <PortfolioTable
        portfolio={portfolio}
        currency={currency}
        onDelete={handleDelete}
      />
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={portfolio}
              dataKey="total"
              nameKey="ticker"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {portfolio.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 60%)`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
