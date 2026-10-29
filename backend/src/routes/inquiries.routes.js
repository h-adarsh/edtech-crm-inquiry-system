import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/inquiries.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
  createInquirySchema,
  listInquiriesQuerySchema,
  updateStatusSchema,
} from '../schemas/inquiry.schema.js';

const router = express.Router();

/**
 * POST /api/inquiries
 * Public endpoint to submit an inquiry from the public form.
 * Rate limited to 20 submissions / 15 minutes per IP.
 */
router.post('/', inquiryLimiter, validate(createInquirySchema, 'body'), createInquiry);

/**
 * GET /api/inquiries
 * Protected admin endpoint to fetch inquiries with filters, search, and pagination.
 * Requires custom JWT Bearer token.
 */
router.get('/', requireAuth, validate(listInquiriesQuerySchema, 'query'), getInquiries);

/**
 * PATCH /api/inquiries/:id/status
 * Protected admin endpoint to update inquiry status.
 * Requires custom JWT Bearer token.
 */
router.patch('/:id/status', requireAuth, validate(updateStatusSchema, 'body'), updateInquiryStatus);

export default router;

