import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [signals, setSignals] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/swing-signals`).then((res) => setSignals(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">📈 Swing Trade Value</h1>
      <table className="w-full text-sm text-left text-gray-700 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">EMA20</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Buy</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((s) => (
            <tr
              key={s.symbol}
              onClick={() => setSelected(s)}
              className="cursor-pointer hover:bg-blue-50"
            >
              <td className="px-4 py-2 font-semibold">{s.symbol}</td>
              <td className="px-4 py-2">${s.ema20}</td>
              <td className="px-4 py-2">${s.price}</td>
              <td className="px-4 py-2">{s.status === "BUY" ? "✅" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{selected.symbol} Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={selected.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} name="Price" />
              <Line type="monotone" dataKey="ema20" stroke="#00C49F" dot={false} name="EMA20" />
              <Line type="monotone" dataKey="ema50" stroke="#FF8042" dot={false} name="EMA50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}