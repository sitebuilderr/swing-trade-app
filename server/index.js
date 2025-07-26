const express = require("express");
const cors = require("cors");
const axios = require("axios");
const ti = require("technicalindicators");

const app = express();
app.use(cors());

const watchlist = ["AAPL", "MSFT", "NVDA", "SHOP.TO", "SU.TO"];

async function fetchData(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&interval=1d`;
  const { data } = await axios.get(url);
  const d = data.chart.result[0];
  return {
    symbol,
    timestamps: d.timestamp,
    closes: d.indicators.quote[0].close,
    volumes: d.indicators.quote[0].volume,
  };
}

function calculate(data) {
  const ema20 = ti.EMA.calculate({ period: 20, values: data.closes });
  const ema50 = ti.EMA.calculate({ period: 50, values: data.closes });
  const rsi = ti.RSI.calculate({ period: 14, values: data.closes });

  const lastClose = data.closes[data.closes.length - 1];
  const lastEMA20 = ema20[ema20.length - 1];
  const lastEMA50 = ema50[ema50.length - 1];
  const lastRSI = rsi[rsi.length - 1];

  const chartData = data.timestamps.map((t, i) => ({
    date: new Date(t * 1000).toISOString().split("T")[0],
    price: data.closes[i],
    ema20: ema20[i - (data.closes.length - ema20.length)],
    ema50: ema50[i - (data.closes.length - ema50.length)],
  })).slice(-60);

  return {
    symbol: data.symbol,
    price: parseFloat(lastClose.toFixed(2)),
    ema20: parseFloat(lastEMA20.toFixed(2)),
    ema50: parseFloat(lastEMA50.toFixed(2)),
    rsi: parseFloat(lastRSI.toFixed(2)),
    status: lastClose > lastEMA20 && lastEMA20 > lastEMA50 ? "BUY" : "NEUTRAL",
    chartData,
  };
}

app.get("/api/swing-signals", async (req, res) => {
  const results = [];
  for (const symbol of watchlist) {
    try {
      const data = await fetchData(symbol);
      results.push(calculate(data));
    } catch (err) {
      console.error(`Error: ${symbol}`, err.message);
    }
  }
  res.json(results);
});

app.listen(5000, () => console.log("Server running on port 5000"));