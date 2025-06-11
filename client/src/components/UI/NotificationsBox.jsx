import React, { useEffect, useState } from 'react';

export default function NotificationsBox() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // TODO: subscribe to socket.io notifications (e.g. incomingChallenge)
    // socket.on('incomingChallenge', data => setNotes(prev => [...prev, data]));
  }, []);

  return (
    <div className="notifications-box">
      <h3 className="font-bold mb-2">Notifications</h3>
      <ul>
        {notes.map((n, i) => (
          <li key={i} className="mb-1 p-2 bg-gray-100 rounded">
            {n.text || JSON.stringify(n)}
          </li>
        ))}
      </ul>
    </div>
  );
}
