
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const tickers = ["AAPL", "MSFT", "NVDA", "SU.TO", "SHOP.TO"];

function App() {
  const [data, setData] = useState({});
  const [buyInputs, setBuyInputs] = useState({});

  const fetchSignals = async () => {
    try {
      const response = await axios.get("https://server-production-e096.up.railway.app/api/swing-signals");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching signals", error);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleBuyInput = (symbol, price) => {
    setBuyInputs(prev => ({ ...prev, [symbol]: parseFloat(price) }));
  };

  const calculateTarget = (buyPrice) => {
    const profitMargin = 0.1;
    return buyPrice ? (buyPrice * (1 + profitMargin)).toFixed(2) : null;
  };

  return (
    <div style={{ padding: 16, fontFamily: "Arial" }}>
      <h1>📊 Swing Trade Value</h1>
      <button onClick={fetchSignals}>🔁 Refresh Signals</button>
      {tickers.map(symbol => {
        const info = data[symbol];
        if (!info) return null;

        return (
          <div key={symbol} style={{ marginBottom: 32 }}>
            <h2>{symbol}</h2>
            <p><strong>Status:</strong> {info.status}</p>
            <p>Price: ${info.price}</p>
            <p>RSI: {info.rsi}</p>
            <p>EMA20: {info.ema20}</p>
            <p>EMA50: {info.ema50}</p>
            <p>Signal Type: {info.signal}</p>

            <label>
              Enter Buy Price: 
              <input 
                type="number" 
                step="0.01"
                value={buyInputs[symbol] || ""}
                onChange={(e) => handleBuyInput(symbol, e.target.value)} 
              />
            </label>
            {buyInputs[symbol] && (
              <p>📈 Target Sale Price (10% Profit): ${calculateTarget(buyInputs[symbol])}</p>
            )}

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={info.chart}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="blue" name="Price" />
                <Line type="monotone" dataKey="ema20" stroke="green" name="EMA20" />
                <Line type="monotone" dataKey="ema50" stroke="orange" name="EMA50" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

export default App;
