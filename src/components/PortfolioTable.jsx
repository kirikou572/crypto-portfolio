// src/components/PortfolioTable.jsx
import React from 'react';

function PortfolioTable({ portfolio, currency, onDelete }) {
  const exchangeRate = 1.1; // simulate EUR/USD rate
  const displayPortfolio = portfolio.reduce((acc, curr) => {
    const existing = acc.find((item) => item.ticker === curr.ticker);
    if (existing) {
      existing.amount += curr.amount;
      existing.total += curr.total;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  const total = displayPortfolio.reduce((sum, p) => sum + p.total, 0);
  const isUSD = currency === 'USD';

  return (
    <div>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Ticker</th>
            <th className="p-2">Quantité</th>
            <th className="p-2">Prix ({isUSD ? '$' : '€'})</th>
            <th className="p-2">Total ({isUSD ? '$' : '€'})</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayPortfolio.map((item) => (
            <tr key={item.ticker} className="border-b">
              <td className="p-2">{item.ticker}</td>
              <td className="p-2">{item.amount.toFixed(4)}</td>
              <td className="p-2">
                {(item.price * (isUSD ? exchangeRate : 1)).toFixed(2)}
              </td>
              <td className="p-2">
                {(item.total * (isUSD ? exchangeRate : 1)).toFixed(2)}
              </td>
              <td className="p-2">
                <button
                  onClick={() => onDelete(item.ticker)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          <tr className="font-bold">
            <td colSpan="3" className="p-2 text-right">
              Total global
            </td>
            <td className="p-2">
              {(total * (isUSD ? exchangeRate : 1)).toFixed(2)} {isUSD ? '$' : '€'}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioTable;
