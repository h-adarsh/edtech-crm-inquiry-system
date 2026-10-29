import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock the database module
vi.mock('../src/config/db.js', () => {
  return {
    query: vi.fn(),
    pool: {
      query: vi.fn(),
      on: vi.fn(),
      end: vi.fn(),
    },
  };
});

import app from '../src/app.js';
import { query } from '../src/config/db.js';
import { env } from '../src/config/env.js';

describe('Inquiries API', () => {
  let validAdminToken;

  beforeEach(() => {
    vi.clearAllMocks();
    validAdminToken = jwt.sign(
      { id: '11111111-1111-1111-1111-111111111111', email: 'admin@edtech.com', name: 'Admin' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/inquiries (Public Form Submission)', () => {
    it('successfully creates an inquiry with valid payload', async () => {
      const mockCreatedInquiry = {
        id: '22222222-2222-2222-2222-222222222222',
        user_type: 'Parent',
        category: 'Scholarship',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 555-0199',
        message: 'I would like to inquire about the merit scholarship program.',
        status: 'new',
        created_at: new Date().toISOString(),
      };

      query.mockResolvedValueOnce({
        rows: [mockCreatedInquiry],
        rowCount: 1,
      });

      const res = await request(app)
        .post('/api/inquiries')
        .send({
          user_type: 'Parent',
          category: 'Scholarship',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '+1 555-0199',
          message: 'I would like to inquire about the merit scholarship program.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Jane Doe');
      expect(res.body.data.status).toBe('new');
      expect(query).toHaveBeenCalledTimes(1);
    });

    it('rejects submission with missing fields (returns 400)', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .send({
          user_type: 'Parent',
          // Missing category, name, email, phone, message
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBeDefined();
    });

    it('rejects invalid user_type (returns 400)', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .send({
          user_type: 'Corporate', // Invalid
          category: 'Scholarship',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '+1 555-0199',
          message: 'Hello, this is a test query message.',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('User Type');
    });

    it('rejects invalid category (returns 400)', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .send({
          user_type: 'Student',
          category: 'InvalidCategory',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '+1 555-0199',
          message: 'Hello, this is a test query message.',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Category');
    });

    it('rejects malformed email format (returns 400)', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .send({
          user_type: 'Student',
          category: 'Admission',
          name: 'Jane Doe',
          email: 'not-an-email',
          phone: '+1 555-0199',
          message: 'Hello, this is a test query message.',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('valid email');
    });
  });

  describe('GET /api/inquiries (Admin Filter, Search & Pagination)', () => {
    it('returns inquiries list with valid JWT token', async () => {
      query
        .mockResolvedValueOnce({ rows: [{ total: '2' }] }) // Count query
        .mockResolvedValueOnce({
          rows: [
            {
              id: '1',
              user_type: 'Parent',
              category: 'Admission',
              name: 'John Smith',
              email: 'john@example.com',
              phone: '1234567890',
              message: 'Admission details needed',
              status: 'new',
            },
          ],
        }); // Data query

      const res = await request(app)
        .get('/api/inquiries')
        .set('Authorization', `Bearer ${validAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.total).toBe(2);
    });

    it('handles pagination for page 2 correctly with calculated offset', async () => {
      query
        .mockResolvedValueOnce({ rows: [{ total: '8' }] })
        .mockResolvedValueOnce({
          rows: [
            { id: '4', name: 'Student 4', status: 'new' },
            { id: '5', name: 'Student 5', status: 'in_progress' },
            { id: '6', name: 'Student 6', status: 'resolved' },
          ],
        });

      const res = await request(app)
        .get('/api/inquiries')
        .query({ page: 2, limit: 3 })
        .set('Authorization', `Bearer ${validAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(3);
      expect(res.body.pagination.totalPages).toBe(3);
      expect(res.body.pagination.total).toBe(8);

      // Verify that offset was calculated as (2 - 1) * 3 = 3
      const dataCallArgs = query.mock.calls[1];
      expect(dataCallArgs[1]).toContain(3); // limit
      expect(dataCallArgs[1]).toContain(3); // offset
    });

    it('handles search queries safely with SQL parameterization (resists SQL Injection)', async () => {
      query
        .mockResolvedValueOnce({ rows: [{ total: '0' }] })
        .mockResolvedValueOnce({ rows: [] });

      const maliciousSearchTerm = "'; DROP TABLE inquiries; --";

      const res = await request(app)
        .get('/api/inquiries')
        .query({ search: maliciousSearchTerm })
        .set('Authorization', `Bearer ${validAdminToken}`);

      expect(res.status).toBe(200);

      // Verify that query was called with bound parameters containing the wildcard term
      const countCallArgs = query.mock.calls[0];
      const countQuerySql = countCallArgs[0];
      const countQueryParams = countCallArgs[1];

      // Ensure raw SQL injection string was NOT concatenated into the query text
      expect(countQuerySql).not.toContain(maliciousSearchTerm);
      // Ensure it was safely passed in the params array
      expect(countQueryParams).toContain(`%${maliciousSearchTerm}%`);
    });
  });

  describe('PATCH /api/inquiries/:id/status (Admin Status Management)', () => {
    it('updates status to in_progress successfully', async () => {
      const updatedRow = {
        id: '22222222-2222-2222-2222-222222222222',
        status: 'in_progress',
        name: 'Jane Doe',
      };

      query.mockResolvedValueOnce({
        rows: [updatedRow],
        rowCount: 1,
      });

      const res = await request(app)
        .patch('/api/inquiries/22222222-2222-2222-2222-222222222222/status')
        .set('Authorization', `Bearer ${validAdminToken}`)
        .send({ status: 'in_progress' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('in_progress');
    });

    it('rejects invalid status (returns 400)', async () => {
      const res = await request(app)
        .patch('/api/inquiries/22222222-2222-2222-2222-222222222222/status')
        .set('Authorization', `Bearer ${validAdminToken}`)
        .send({ status: 'cancelled' }); // Invalid status

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Status must be one of');
    });

    it('returns 404 when inquiry ID does not exist', async () => {
      query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });

      const res = await request(app)
        .patch('/api/inquiries/00000000-0000-0000-0000-000000000000/status')
        .set('Authorization', `Bearer ${validAdminToken}`)
        .send({ status: 'resolved' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });
});

