const API = 'http://localhost:3000';
let portfolio = [];
let pieChart = null;

// Helpers pour auth
function getToken() {
  return localStorage.getItem('token');
}
function redirectToLogin() {
  window.location.href = 'index.html';
}

// Auth check
if (!getToken()) redirectToLogin();

// Déconnexion
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  redirectToLogin();
});

// Chargement initial
window.addEventListener('DOMContentLoaded', loadAndRender);

async function loadAndRender() {
  await fetchPortfolio();
  await fetchPrices();
  renderTable();
  renderChart();
}

// Récupère le portefeuille
async function fetchPortfolio() {
  const res = await fetch(`${API}/portfolio`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (res.status === 401) return redirectToLogin();
  portfolio = await res.json();
}

// Récupère les prix groupés
async function fetchPrices() {
  if (!portfolio.length) return;
  const symbols = portfolio.map(c => c.symbol).join(',');
  const res = await fetch(`${API}/portfolio/prices?symbols=${symbols}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const prices = await res.json();
  portfolio = portfolio.map(c => ({
    ...c,
    currentPrice: prices[c.symbol] || 0
  }));
}

// Affiche le tableau
function renderTable() {
  const body = document.getElementById('portfolio-body');
  body.innerHTML = '';
  portfolio.forEach(c => {
    const value = (c.currentPrice * c.amount).toFixed(2);
    const gain = ((c.currentPrice - c.buyPrice) * c.amount).toFixed(2);
    body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${c.symbol}</td>
        <td>${c.amount}</td>
        <td>$${c.buyPrice.toFixed(2)}</td>
        <td>$${c.currentPrice.toFixed(2)}</td>
        <td>$${value}</td>
        <td style="color:${gain>=0?'green':'red'}">$${gain}</td>
      </tr>
    `);
  });
}

// Affiche le graphique camembert
function renderChart() {
  const ctx = document.getElementById('pieChart').getContext('2d');
  const labels = portfolio.map(c => c.symbol);
  const data = portfolio.map(c => c.currentPrice * c.amount);
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: 'pie',
    data: { labels, datasets: [{ data }] },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

// Ajout de crypto
document.getElementById('add-crypto-form').addEventListener('submit', async e => {
  e.preventDefault();
  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const amount = parseFloat(document.getElementById('amount').value);
  const buyPrice = parseFloat(document.getElementById('buyPrice').value);
  await fetch(`${API}/portfolio/add`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ symbol, amount, buyPrice })
  });
  e.target.reset();
  await loadAndRender();
});

// Bouton Actualiser
document.getElementById('refresh-btn').addEventListener('click', async () => {
  await fetchPrices();
  renderTable();
  renderChart();
});
