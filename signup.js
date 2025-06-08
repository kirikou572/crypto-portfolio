const signupForm = document.getElementById('signupForm');
const messageDiv = document.getElementById('message');

const backendUrl = 'https://crypto-portfolio-production-b673.up.railway.app';

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${backendUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      messageDiv.textContent = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
    } else {
      messageDiv.textContent = `Erreur : ${data.message}`;
    }
  } catch (error) {
    messageDiv.textContent = 'Erreur réseau : impossible de joindre le serveur.';
  }
});
