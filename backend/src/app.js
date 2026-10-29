import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import inquiriesRoutes from './routes/inquiries.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Required behind reverse proxies like Render / Vercel to correctly identify client IP
app.set('trust proxy', 1);

// HTTP Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing configuration
const allowedOrigins = [
  env.FRONTEND_URL.replace(/\/$/, ''), // strip any accidental trailing slash
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing with safe size bounds
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Mount API routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// Catch-all 404 handler
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;

