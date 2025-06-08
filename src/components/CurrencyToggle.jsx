import React from "react";

function CurrencyToggle({ currency, onToggle }) {
  return (
    <div className="text-right mb-4">
      <button
        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
        onClick={onToggle}
      >
        Convertir en {currency === "€" ? "$" : "€"}
      </button>
    </div>
  );
}

export default CurrencyToggle;
