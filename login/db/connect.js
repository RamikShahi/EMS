require('dotenv').config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 5,     // reduce if MaxScale limit is low
  connectTimeout: 10000,  // 10s
  acquireTimeout: 10000,  // 10s
  idleTimeout: 30000,     // 30s
  ssl: true               // only if your cluster requires SSL
});



module.exports = pool
