import { env } from '../config/env.js';

/**
 * 404 handler for routes not found
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Centralized error handling middleware.
 * Prevents stack trace leakages in client responses.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // PostgreSQL duplicate key violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with this identifier already exists.',
    });
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      message: 'Validation constraint violated in database.',
    });
  }

  // PostgreSQL invalid UUID syntax
  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format provided.',
    });
  }

  // Custom client errors
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && env.NODE_ENV === 'production'
    ? 'An internal server error occurred. Please try again later.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

