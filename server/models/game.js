const db = require('../db');
async function getWaitingUsers() {
  const r = await db.query(
    "SELECT telegram_id,bet_amount FROM users WHERE state='WAIT' ORDER BY updated_at"
  );
  return r.rows;
}
async function createGame(playerA, bet) {
  const r = await db.query(
    'INSERT INTO games(player_a,bet_amount) VALUES($1,$2) RETURNING game_id',
    [playerA, bet]
  );
  return r.rows[0].game_id;
}
module.exports = { getWaitingUsers, createGame };