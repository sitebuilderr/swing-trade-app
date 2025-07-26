const express = require("express");
const axios = require("axios");
const cors = require("cors");
const technicalIndicators = require("technicalindicators");

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

const watchlist = ["AAPL", "MSFT", "NVDA", "SHOP.TO", "SU.TO"];

async function fetchHistoricalPrices(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&interval=1d`;
  const { data } = await axios.get(url);
  const prices = data.chart.result[0];
  return {
    symbol,
    timestamps: prices.timestamp,
    closes: prices.indicators.quote[0].close,
    volumes: prices.indicators.quote[0].volume,
  };
}

function calculateIndicators(data) {
  const ema20 = technicalIndicators.EMA.calculate({ period: 20, values: data.closes });
  const ema50 = technicalIndicators.EMA.calculate({ period: 50, values: data.closes });
  const rsi = technicalIndicators.RSI.calculate({ period: 14, values: data.closes });
  const lastClose = data.closes[data.closes.length - 1];
  const lastRSI = rsi[rsi.length - 1];
  const lastEMA20 = ema20[ema20.length - 1];
  const lastEMA50 = ema50[ema50.length - 1];

  let status = "NEUTRAL";
  let signalType = "";

  if (lastClose > lastEMA20 && lastEMA20 > lastEMA50 && lastRSI < 70) {
    status = "BUY";
    signalType = "Breakout";
  } else if (lastClose < lastEMA20 && lastRSI >= 40 && lastRSI <= 60) {
    status = "WATCH";
    signalType = "Pullback";
  }

  const chartData = data.timestamps.map((t, i) => ({
    date: new Date(t * 1000).toISOString().split("T")[0],
    price: data.closes[i],
    ema20: ema20[i - (data.closes.length - ema20.length)],
    ema50: ema50[i - (data.closes.length - ema50.length)],
  })).slice(-60);

  return {
    symbol: data.symbol,
    price: lastClose,
    ema20: parseFloat(lastEMA20.toFixed(2)),
    ema50: parseFloat(lastEMA50.toFixed(2)),
    rsi: parseFloat(lastRSI.toFixed(2)),
    status,
    signalType,
    chartData,
  };
}

app.get("/api/swing-signals", async (req, res) => {
  const results = [];
  for (const symbol of watchlist) {
    try {
      const priceData = await fetchHistoricalPrices(symbol);
      const indicators = calculateIndicators(priceData);
      results.push(indicators);
    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
    }
  }
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});