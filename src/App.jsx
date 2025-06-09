// src/App.jsx
import React, { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [currency, setCurrency] = useState('USD');

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'USD' ? 'EUR' : 'USD'));
  };

  return <Dashboard currency={currency} toggleCurrency={toggleCurrency} />;
}

export default App;
