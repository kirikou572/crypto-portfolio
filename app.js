const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const fetchPortfolioBtn = document.getElementById('fetchPortfolio');
const portfolioData = document.getElementById('portfolioData');

const backendUrl = 'https://crypto-portfolio-production-b673.up.railway.app';

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      messageDiv.textContent = 'Connexion réussie !';
      localStorage.setItem('token', data.token);
    } else {
      messageDiv.textContent = `Erreur : ${data.message}`;
    }
  } catch (error) {
    messageDiv.textContent = 'Erreur réseau : impossible de joindre le serveur.';
  }
});

fetchPortfolioBtn.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    messageDiv.textContent = 'Vous devez être connecté pour voir le portfolio.';
    return;
  }

  try {
    const res = await fetch(`${backendUrl}/portfolio`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();

    if (res.ok) {
      portfolioData.textContent = JSON.stringify(data.portfolio, null, 2);
    } else {
      portfolioData.textContent = '';
      messageDiv.textContent = `Erreur : ${data.message}`;
    }
  } catch (error) {
    portfolioData.textContent = '';
    messageDiv.textContent = 'Erreur réseau : impossible de joindre le serveur.';
  }
});
