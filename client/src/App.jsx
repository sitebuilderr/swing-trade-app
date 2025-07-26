
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [signals, setSignals] = useState([])

  useEffect(() => {
    axios.get('https://server-production-e096.up.railway.app/api/swing-signals')
      .then(res => setSignals(res.data))
      .catch(err => console.error("Error fetching signals:", err))
  }, [])

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h1>Swing Trade Signals</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Company</th>
              <th>Score</th>
              <th>MOS</th>
              <th>4M</th>
              <th>Sector</th>
              <th>Price</th>
              <th>Fair Value</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(signals) && signals.map((stock, index) => (
              <tr key={index}>
                <td>{stock.ticker}</td>
                <td>{stock.company}</td>
                <td>{stock.score}</td>
                <td>{stock.mos}</td>
                <td>{stock.momentum}</td>
                <td>{stock.sector}</td>
                <td>{stock.price}</td>
                <td>{stock.fairValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
