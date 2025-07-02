require('dotenv').config({ path: __dirname + '/../.env' }); // مسیر دقیق به .env
console.log('DB_PASS:', process.env.DB_PASS, typeof process.env.DB_PASS); // دیباگ
const { Pool } = require('pg');
module.exports = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'penaltydb',
  user: process.env.DB_USER || 'penaltyuser',
  password: process.env.DB_PASS || 'moh091908479012235',
  port: process.env.DB_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000
});