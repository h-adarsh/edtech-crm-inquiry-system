import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for public inquiry form submissions
 * Limits excessive spam/bots: 20 submissions per 15 minutes per IP
 */
export const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this IP, please try again after 15 minutes.',
  },
});

/**
 * Rate limiter for admin login endpoint
 * Protects against credential stuffing & brute-force: 10 attempts per 15 minutes per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
  },
});

