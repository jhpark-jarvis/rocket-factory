import mariadb from 'mariadb';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';

dotenv.config();

const host = process.env.DB_HOST || process.env.DATABASE_HOST;
const user = process.env.DB_USER || process.env.DATABASE_USER;
const password = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD;
const database = process.env.DB_NAME || process.env.DATABASE_NAME;
const port = Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306);

const pool = mariadb.createPool({
  host,
  user,
  password,
  database,
  port,
  connectionLimit: 5,
});

async function runConnectionTest() {
  let conn;

  try {
    conn = await pool.getConnection();
    const [ping] = await conn.query('SELECT 1 AS ok, DATABASE() AS db, NOW() AS now');

    console.log('DB connection ok:', {
      ok: ping.ok,
      database: ping.db,
      now: ping.now,
    });

    return ping;
  } finally {
    if (conn) conn.release();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runConnectionTest()
    .catch((error) => {
      console.error('DB connection failed:', error.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}

export default pool;
