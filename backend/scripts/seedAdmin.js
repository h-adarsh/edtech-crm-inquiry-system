import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL is not set in backend/.env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || process.argv[2] || 'admin@edtech.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || process.argv[3] || 'AdminPassword123!';
  const name = process.env.ADMIN_NAME || process.argv[4] || 'System Administrator';

  console.log(`--- Seeding Admin User ---`);
  console.log(`Target Email: ${email}`);
  console.log(`Target Name:  ${name}`);

  try {
    // 1. Hash the password with bcryptjs (salt cost: 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 2. Insert or update the administrator in Supabase Postgres
    const sql = `
      INSERT INTO admins (email, password_hash, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name
      RETURNING id, email, name, created_at;
    `;

    const result = await pool.query(sql, [email, passwordHash, name]);
    const seededAdmin = result.rows[0];

    console.log(`Admin user successfully seeded!`);
    console.log(`ID:         ${seededAdmin.id}`);
    console.log(`Email:      ${seededAdmin.email}`);
    console.log(`Name:       ${seededAdmin.name}`);
    console.log(`Created At: ${seededAdmin.created_at}`);
    console.log(`\nDefault Credentials for Login:`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`-----------------------------------`);
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdmin();

