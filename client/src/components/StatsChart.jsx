import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function StatsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/game/stats')
      .then(res => {
        // فرض: سرور آرایه‌ای از { round, success_rate } می‌دهد
        setData(res.data.map(s => ({
          round: `R${s.round}`,
          success: s.success_rate
        })));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="analytics-box p-4">
      <h3 className="font-bold mb-2">Game Stats</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="round" />
          <YAxis unit="%" />
          <Tooltip />
          <Line type="monotone" dataKey="success" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
