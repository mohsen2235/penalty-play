import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get('/game/leaderboard')
      .then(res => setLeaders(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="leaderboard-section p-4">
      <h3 className="font-bold mb-2">Leaderboard</h3>
      <ol className="list-decimal list-inside">
        {leaders.map((u, i) => (
          <li key={u.telegram_id}>
            {u.telegram_id}: {u.wins} wins
          </li>
        ))}
      </ol>
    </div>
  );
}
