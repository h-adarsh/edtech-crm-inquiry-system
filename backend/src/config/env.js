import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root or parent if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

// Crash on startup if any critical environment variable is missing (per architectural rule)
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL CONFIG ERROR: Missing required environment variable [${envVar}].`);
    console.error('Please configure your .env file according to .env.example before starting.');
    process.exit(1);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

