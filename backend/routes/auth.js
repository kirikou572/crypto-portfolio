// auth.js

const API_BASE_URL = "https://crypto-portfolio-production-b673.up.railway.app";

async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la connexion");
    }

    const data = await response.json();
    // Traitement après connexion réussie, par ex. stocker token
    console.log("Connexion réussie :", data);
    return data;
  } catch (error) {
    console.error("Erreur login:", error.message);
    throw error;
  }
}

async function signup(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'inscription");
    }

    const data = await response.json();
    console.log("Inscription réussie :", data);
    return data;
  } catch (error) {
    console.error("Erreur signup:", error.message);
    throw error;
  }
}
