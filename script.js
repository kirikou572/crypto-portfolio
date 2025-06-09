// Remplace par l'URL de ton backend déployé sur Railway
const API_BASE_URL = 'https://crypto-portfolio-production-b673.up.railway.app';

const form = document.getElementById('login-form');
const portfolioList = document.getElementById('portfolio-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    // 1️⃣ Connexion
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Erreur login');

    const token = loginData.token;

    // 2️⃣ Récupérer le portfolio
    const portRes = await fetch(`${API_BASE_URL}/portfolio`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const portData = await portRes.json();
    portfolioList.innerHTML = '';

    portData.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.crypto} : ${item.amount}`;
      portfolioList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert('Erreur : ' + err.message);
  }
});
