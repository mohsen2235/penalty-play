require('dotenv').config();
console.log('DB_PASS:', process.env.DB_PASS, typeof process.env.DB_PASS);
const { Pool } = require('pg');
module.exports = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 10,
  idleTimeoutMillis: 30000
});