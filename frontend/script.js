
const BASE_URL = 'https://crypto-portfolio-production-b673.up.railway.app';

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    alert('Login successful! Token: ' + data.token);
  } catch (error) {
    console.error(error);
    alert('Failed to login: ' + error.message);
  }
}
