import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TransactionHistory() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    axios.get('/transactions')
      .then(res => setTxs(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="transaction-history p-4">
      <h3 className="font-bold mb-2">Transaction History</h3>
      <ul>
        {txs.map((t, i) => (
          <li key={i} className="mb-1">
            <span>{new Date(t.created_at).toLocaleString()}</span> — 
            <span>{t.type} {t.amount} USDT {t.to_address ? `to ${t.to_address}` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
