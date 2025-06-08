import React from "react";

function PortfolioTable({ portfolio, onDelete, currency, rate }) {
  const grouped = portfolio.reduce((acc, item) => {
    const key = item.ticker;
    if (!acc[key]) {
      acc[key] = { ...item };
    } else {
      acc[key].amount += item.amount;
      acc[key].total += item.total;
    }
    return acc;
  }, {});

  const totalValue = Object.values(grouped).reduce(
    (sum, crypto) => sum + crypto.total,
    0
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Ticker</th>
            <th className="py-2 px-4">Quantité</th>
            <th className="py-2 px-4">Prix ({currency})</th>
            <th className="py-2 px-4">Total ({currency})</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(grouped).map((crypto, i) => (
            <tr key={i} className="text-center border-t">
              <td className="py-2 px-4">{crypto.ticker}</td>
              <td className="py-2 px-4">{crypto.amount}</td>
              <td className="py-2 px-4">{(crypto.price * rate).toFixed(2)}</td>
              <td className="py-2 px-4">{(crypto.total * rate).toFixed(2)}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => onDelete(crypto.ticker)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          <tr className="font-bold border-t">
            <td colSpan="3" className="py-2 px-4 text-right">
              Total :
            </td>
            <td className="py-2 px-4">{(totalValue * rate).toFixed(2)}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioTable;
