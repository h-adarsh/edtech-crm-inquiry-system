import express from 'express';
import { login, getProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas/auth.schema.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Public endpoint to authenticate admin and receive custom JWT
 */
router.post('/login', loginLimiter, validate(loginSchema), login);

/**
 * GET /api/auth/me
 * Protected endpoint to retrieve authenticated admin profile
 */
router.get('/me', requireAuth, getProfile);

export default router;

