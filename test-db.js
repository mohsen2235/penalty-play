const db = require('./server/db');
(async () => {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Database connected:', res.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
  }
})(); 