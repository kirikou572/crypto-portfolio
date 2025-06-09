export async function getCryptoPrice(ticker) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ticker.toLowerCase()}&vs_currencies=eur`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data[ticker.toLowerCase()] || !data[ticker.toLowerCase()].eur) {
    throw new Error("Prix introuvable");
  }

  return data[ticker.toLowerCase()].eur;
}

export async function getConversionRate(from, to) {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${from},${to}`;
    const res = await fetch(url);
    const data = await res.json();

    const rate = data.bitcoin[to] / data.bitcoin[from];
    return rate;
  } catch (err) {
    console.error("Conversion failed:", err.message);
    throw new Error("Impossible de récupérer le taux de change");
  }
}
