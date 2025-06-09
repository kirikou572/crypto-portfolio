import fetch from "node-fetch";

const CMC_API_KEY = process.env.CMC_API_KEY;

async function getCryptoPrice(ticker) {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${ticker}&convert=EUR`;

  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": CMC_API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur API CoinMarketCap: ${response.status}`);
  }

  const data = await response.json();

  if (!data.data || !data.data[ticker] || !data.data[ticker].quote.EUR.price) {
    throw new Error("Prix introuvable");
  }

  return data.data[ticker].quote.EUR.price;
}

export default getCryptoPrice;
