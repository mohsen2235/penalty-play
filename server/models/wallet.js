const db = require('../db');
const { sendUSDT } = require('../services/tron');

async function getBalance(id) {
  const r = await db.query(
    'SELECT balance FROM wallets WHERE telegram_id=$1',
    [id]
  );
  return r.rows[0]?.balance || 0;
}
async function depositUSDT(id, amt) {
  await db.query(
    `INSERT INTO wallets(telegram_id,balance) VALUES($1,$2)
     ON CONFLICT(telegram_id) DO UPDATE SET balance=wallets.balance+$2`,
    [id, amt]
  );
}
async function withdrawUSDT(id, to, amt) {
  const bal = await getBalance(id);
  if (bal < amt) throw new Error('Insufficient');
  await db.query(
    'UPDATE wallets SET balance=balance-$1 WHERE telegram_id=$2',
    [amt, id]
  );
  await sendUSDT(to, amt);
}
module.exports = { getBalance, depositUSDT, withdrawUSDT };