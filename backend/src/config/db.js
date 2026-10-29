import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

// Supabase cloud Postgres requires SSL for pooler and direct connections.
// rejectUnauthorized: false avoids certificate validation failures on cloud container providers like Render.
const poolConfig = {
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Maintain a resilient pool size within Supabase free-tier limits
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client pool:', err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (env.NODE_ENV === 'development') {
    // Log query execution time without exposing sensitive data
    const truncatedText = text.trim().split('\n')[0].substring(0, 80);
    // console.log(`[DB Query] ${truncatedText} | took ${duration}ms | returned ${res.rowCount} rows`);
  }
  return res;
};

