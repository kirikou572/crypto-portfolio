// portfolio.js

const API_BASE_URL = "https://crypto-portfolio-production-b673.up.railway.app";

async function getPortfolio(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du portfolio");
    }

    const data = await response.json();
    console.log("Portfolio reçu :", data);
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function addCrypto(token, cryptoData) {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(cryptoData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la crypto");
    }

    const data = await response.json();
    console.log("Crypto ajoutée :", data);
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
