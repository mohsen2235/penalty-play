import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../../store';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // TODO: subscribe to socket.io chatMessage event
    // socket.on('chatMessage', msg => setMessages(prev => [...prev, msg]));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    // TODO: emit via socket.io instead:
    // socket.emit('chatMessage', input);
    setInput('');
  };

  return (
    <div className="chat-box">
      <div className="messages h-40 overflow-y-auto">
        {messages.map((m, i) => <div key={i}>{m}</div>)}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 p-2 rounded-l"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="p-2 bg-blue-500 text-white rounded-r" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
