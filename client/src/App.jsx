import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const App = () => {
  const [data, setData] = useState([]);
  const [buyPrices, setBuyPrices] = useState({});

  const fetchSignals = async () => {
    try {
      const res = await axios.get('/api/swing-signals');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching signals:', error);
    }
  };

  const handleBuyInput = (ticker, value) => {
    setBuyPrices({ ...buyPrices, [ticker]: parseFloat(value) });
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>📊 Swing Trade Signals</h1>
      <button onClick={fetchSignals}>🔄 Refresh Signals</button>
      {data.map(stock => {
        const chartData = stock.history.map((p, i) => ({
          date: stock.dates[i],
          price: p,
          ema20: stock.ema20[i],
          ema50: stock.ema50[i],
        }));
        const buy = buyPrices[stock.ticker];
        const suggestion = buy ? `Suggested sell: $${(buy * 1.05).toFixed(2)} (5% profit)` : '';
        return (
          <div key={stock.ticker} style={{ marginBottom: '2rem' }}>
            <h2>{stock.ticker}</h2>
            <p><strong>Status:</strong> {stock.status}</p>
            <p><strong>Price:</strong> ${stock.price}</p>
            <p><strong>RSI:</strong> {stock.rsi}</p>
            <p><strong>EMA20:</strong> {stock.ema20Current}</p>
            <p><strong>EMA50:</strong> {stock.ema50Current}</p>
            <p><strong>Signal Type:</strong> {stock.signalType}</p>
            <div>
              <label>Buy Price: </label>
              <input type="number" step="0.01" onChange={e => handleBuyInput(stock.ticker, e.target.value)} />
              <span style={{ marginLeft: '1rem' }}>{suggestion}</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin', 'dataMax']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="blue" dot={false} />
                <Line type="monotone" dataKey="ema20" stroke="green" dot={false} />
                <Line type="monotone" dataKey="ema50" stroke="orange" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
};

export default App;
