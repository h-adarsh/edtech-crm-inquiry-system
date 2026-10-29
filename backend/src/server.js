import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const PORT = env.PORT;

const server = app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(` EdTech CRM API Server running in [${env.NODE_ENV}] mode`);
  console.log(` Port: ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Allowed Frontend: ${env.FRONTEND_URL}`);
  console.log(`====================================================`);

  // Verify database connectivity on boot
  try {
    const res = await pool.query('SELECT NOW() AS connected_time');
    console.log(`[Database] Connected to PostgreSQL successfully at ${res.rows[0].connected_time}`);
  } catch (err) {
    console.error(`[Database Warning] Could not connect to PostgreSQL: ${err.message}`);
    console.error('Verify your DATABASE_URL in .env (ensure you are using the Supabase pooler URL).');
  }
});

// Graceful shutdown handling
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log('Database pool drained.');
      process.exit(0);
    } catch (err) {
      console.error('Error draining database pool:', err.message);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

