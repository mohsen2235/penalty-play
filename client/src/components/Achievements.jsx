import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Achievements() {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get('/achievements')
      .then(res => setList(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="achievements p-4">
      <h3 className="font-bold mb-2">Achievements</h3>
      <ul className="grid grid-cols-3 gap-4">
        {list.map(a => (
          <li key={a.id} className="text-center">
            <img
              src={`/icons/${a.code}.png`}
              alt={a.code}
              className={`w-12 h-12 ${a.unlocked ? '' : 'opacity-30'}`}
            />
            <p>{a.code}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
