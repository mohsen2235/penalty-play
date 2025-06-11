const db = require('../db');
async function getAchievementsForUser(id) {
  const r = await db.query(
    'SELECT id,code,unlocked FROM achievements_view WHERE telegram_id=$1 ORDER BY created_at',
    [id]
  );
  return r.rows;
}
module.exports = { getAchievementsForUser };