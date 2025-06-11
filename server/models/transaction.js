const db = require('../db');
async function logTransaction(id, type, amt, to=null) {
  await db.query(
    'INSERT INTO transactions(telegram_id,type,amount,to_address) VALUES($1,$2,$3,$4)',
    [id, type, amt, to]
  );
}
async function getTransactions(id) {
  const r = await db.query(
    'SELECT type,amount,to_address,created_at FROM transactions WHERE telegram_id=$1 ORDER BY created_at DESC LIMIT 20',
    [id]
  );
  return r.rows;
}
module.exports = { logTransaction, getTransactions };