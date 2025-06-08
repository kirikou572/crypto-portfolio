// src/components/PortfolioTable.jsx
import React from "react";

function PortfolioTable({ portfolio, currency, convertPrice, onDelete }) {
  const totalSum = portfolio.reduce((acc, p) => acc + (currency === 'USD' ? convertPrice(p.total) : p.total), 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Ticker</th>
            <th className="px-4 py-2">Quantité</th>
            <th className="px-4 py-2">Prix ({currency === 'USD' ? '$' : '€'})</th>
            <th className="px-4 py-2">Total ({currency === 'USD' ? '$' : '€'})</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{item.ticker}</td>
              <td className="border px-4 py-2">{item.amount}</td>
              <td className="border px-4 py-2">
                {(currency === 'USD' ? convertPrice(item.price) : item.price).toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                {(currency === 'USD' ? convertPrice(item.total) : item.total).toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onDelete(item.ticker)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          <tr className="font-semibold bg-gray-200">
            <td colSpan="3" className="px-4 py-2 text-right">Total du portefeuille :</td>
            <td className="px-4 py-2">
              {totalSum.toFixed(2)} {currency === 'USD' ? '$' : '€'}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioTable;
