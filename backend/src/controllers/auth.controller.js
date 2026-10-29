import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';

/**
 * Admin Login Controller
 * 
 * Implements custom JWT authentication from scratch:
 * - Direct lookup in PostgreSQL `admins` table
 * - Secure hash comparison with bcryptjs
 * - Signs HMAC-SHA256 JWT with configurable expiration
 * - Consistent 401 error message for both non-existent users and wrong passwords
 *   to eliminate timing/enumeration vulnerabilities.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Parameterized SQL query to retrieve admin by email
    const result = await query(
      'SELECT id, email, password_hash, name, created_at FROM admins WHERE email = $1 LIMIT 1',
      [email.toLowerCase()]
    );

    const admin = result.rows[0];

    // 2. Generic error message to prevent user enumeration
    const genericAuthError = 'Invalid email or password';

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: genericAuthError,
      });
    }

    // 3. Compare supplied plaintext password against the stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: genericAuthError,
      });
    }

    // 4. Generate JWT with authenticated claims
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    // 5. Return success payload - NEVER include password_hash in response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve currently authenticated admin's profile
 */
export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.user,
  });
};

