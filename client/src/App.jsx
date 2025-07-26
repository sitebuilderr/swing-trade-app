import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/swing-signals`);
      console.log("Signals from API:", response.data); // Debug log
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        📊 Swing Trade Signals
      </h1>
      <div className="text-center mb-6">
        <button
          onClick={fetchSignals}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          {loading ? "Loading..." : "🔄 Refresh Signals"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(signals) && signals.map((signal) => (
          <div
            key={signal.symbol}
            className="bg-white border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">
              {signal.symbol}
            </h2>
            <div className="space-y-1 text-gray-700 text-sm">
              <p>Status: <strong>{signal.status}</strong></p>
              <p>Price: ${signal.price.toFixed(2)}</p>
              <p>RSI: {signal.rsi}</p>
              <p>EMA20: {signal.ema20}</p>
              <p>EMA50: {signal.ema50}</p>
              <p>Signal Type: {signal.signalType || "-"}</p>
            </div>

            {signal.chartData && (
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={signal.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      dot={false}
                      name="Price"
                    />
                    <Line
                      type="monotone"
                      dataKey="ema20"
                      stroke="#00C49F"
                      dot={false}
                      name="EMA20"
                    />
                    <Line
                      type="monotone"
                      dataKey="ema50"
                      stroke="#FF8042"
                      dot={false}
                      name="EMA50"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}