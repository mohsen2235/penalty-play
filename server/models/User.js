const db = require('../db');
async function getUserProfile(id) {
  const r = await db.query(
    'SELECT telegram_id, state, profile_image FROM users WHERE telegram_id=$1',
    [id]
  );
  return r.rows[0];
}
async function updateProfileImage(id, url) {
  await db.query(
    'UPDATE users SET profile_image=$1 WHERE telegram_id=$2',
    [url, id]
  );
}
module.exports = { getUserProfile, updateProfileImage };