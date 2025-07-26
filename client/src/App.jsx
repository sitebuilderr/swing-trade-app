
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sparklines, SparklinesLine } from "react-sparklines";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/swing-signals`);
      setSignals(response.data);
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📈 Swing Trade Signals</h1>
        <button
          onClick={fetchSignals}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </header>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-200 text-xs font-semibold text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Ticker</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">RSI</th>
              <th className="px-4 py-2">EMA20</th>
              <th className="px-4 py-2">EMA50</th>
              <th className="px-4 py-2">Signal Type</th>
              <th className="px-4 py-2">Chart</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((s) => (
              <tr key={s.symbol} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{s.symbol}</td>
                <td className="px-4 py-2">{s.status}</td>
                <td className="px-4 py-2">${s.price.toFixed(2)}</td>
                <td className="px-4 py-2">{s.rsi}</td>
                <td className="px-4 py-2">{s.ema20}</td>
                <td className="px-4 py-2">{s.ema50}</td>
                <td className="px-4 py-2">{s.signalType}</td>
                <td className="px-4 py-2">
                  {s.chartData && (
                    <Sparklines data={s.chartData.map((d) => d.price)}>
                      <SparklinesLine color="blue" />
                    </Sparklines>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
