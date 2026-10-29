import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock the database pool query method
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

describe('Auth & Custom JWT Flow', () => {
  const dummyPassword = 'AdminPassword123!';
  let hashedPassword;

  beforeEach(async () => {
    vi.clearAllMocks();
    hashedPassword = await bcrypt.hash(dummyPassword, 10);
  });

  it('Login with correct credentials returns 200 and a JWT token', async () => {
    query.mockResolvedValueOnce({
      rows: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'admin@edtech.com',
          name: 'System Admin',
          password_hash: hashedPassword,
        },
      ],
      rowCount: 1,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@edtech.com', password: dummyPassword });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin).toBeDefined();
    expect(res.body.admin.email).toBe('admin@edtech.com');
    // Ensure password_hash is NEVER exposed in the response
    expect(res.body.password_hash).toBeUndefined();
    expect(res.body.admin.password_hash).toBeUndefined();
  });

  it('Wrong password returns 401 with generic "Invalid email or password" message', async () => {
    query.mockResolvedValueOnce({
      rows: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'admin@edtech.com',
          name: 'System Admin',
          password_hash: hashedPassword,
        },
      ],
      rowCount: 1,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@edtech.com', password: 'WrongPasswordXYZ!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('Unknown email returns 401 with the EXACT same generic error message', async () => {
    query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: dummyPassword });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('Protected route with no token returns 401', async () => {
    const res = await request(app).get('/api/inquiries');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Authentication required');
  });

  it('Protected route with tampered/invalid token returns 401', async () => {
    const res = await request(app)
      .get('/api/inquiries')
      .set('Authorization', 'Bearer invalid.tampered.token.here');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid or malformed authentication token');
  });

  it('Protected route with expired token returns 401', async () => {
    const expiredToken = jwt.sign(
      { id: '11111111-1111-1111-1111-111111111111', email: 'admin@edtech.com' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }
    );

    const res = await request(app)
      .get('/api/inquiries')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('session expired');
  });
});

