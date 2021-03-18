const PGPool = require('pg').Pool;
const pool = new PGPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
