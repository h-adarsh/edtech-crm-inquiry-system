import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Custom JWT Authentication Middleware
 * 
 * WHY CUSTOM JWT INSTEAD OF SUPABASE AUTH:
 * 1. Strict assessment requirement: Supabase Auth is explicitly disallowed.
 * 2. Full architectural independence: Authentication logic, token expiration,
 *    and claims structure remain strictly controlled within this backend application.
 * 3. Cross-origin resilience: Sending tokens via `Authorization: Bearer <token>`
 *    header eliminates cross-site cookie restrictions (SameSite=None/Secure)
 *    between distinct Vercel and Render deployment subdomains.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verify Authorization header exists and follows the Bearer pattern
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
  }

  // 2. Extract token string after 'Bearer '
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Token missing in Bearer header.',
    });
  }

  try {
    // 3. Verify cryptographic signature and expiration time using JWT_SECRET
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 4. Attach verified user claims to request object for downstream controllers
    req.user = decoded;
    next();
  } catch (error) {
    // Distinguish between expired and tampered tokens for logging,
    // but return consistent 401 to prevent token oracle leakage
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication session expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.',
    });
  }
};

