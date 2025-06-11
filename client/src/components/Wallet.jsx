import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amt, setAmt] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    axios.get('/user/wallet')
      .then(res => setBalance(res.data.balance))
      .catch(console.error);
  }, []);

  const deposit = async () => {
    const res = await axios.post('/user/wallet/deposit', { amount: parseFloat(amt) });
    setBalance(res.data.balance);
    setAmt('');
  };

  const withdraw = async () => {
    const res = await axios.post('/user/wallet/withdraw', {
      amount: parseFloat(amt),
      toAddress: to
    });
    setBalance(res.data.balance);
    setAmt(''); setTo('');
  };

  return (
    <div className="wallet p-4">
      <h3 className="font-bold mb-2">Wallet</h3>
      <p>Balance: {balance} USDT</p>
      <input
        type="number"
        placeholder="Amount"
        value={amt}
        onChange={e => setAmt(e.target.value)}
        className="border p-1 mr-2"
      />
      <input
        type="text"
        placeholder="To address (for withdraw)"
        value={to}
        onChange={e => setTo(e.target.value)}
        className="border p-1 mr-2"
      />
      <button onClick={deposit} className="p-2 bg-blue-500 text-white mr-2">Deposit</button>
      <button onClick={withdraw} className="p-2 bg-red-500 text-white">Withdraw</button>
    </div>
  );
}
