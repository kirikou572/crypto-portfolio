import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.CMC_API_KEY;
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

export async function getCryptoPrice(ticker) {
  const url = `${BASE_URL}?symbol=${ticker}&convert=EUR`;

  const res = await fetch(url, {
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`CoinMarketCap API Error: ${errText}`);
  }

  const data = await res.json();
  const price = data.data[ticker]?.quote?.EUR?.price;
  return price;
}
