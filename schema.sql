-- ==============================================================================
-- EdTech CRM & Inquiry System — Database Schema (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. Enable UUID generation extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-initializing (Optional / Clean Slate)
-- DROP TABLE IF EXISTS inquiries CASCADE;
-- DROP TABLE IF EXISTS admins CASCADE;

-- 3. Create 'admins' table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Administrator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create 'inquiries' table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('Parent', 'Student', 'School')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Scholarship', 'Concert', 'Admission', 'General Query')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Performance Indexes for Filter & Sort operations
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON inquiries (category);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_type ON inquiries (user_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);

-- Optional: Initial Admin Seed Comment
-- To seed an admin, you can run: `npm run seed:admin` in the backend directory
-- or execute the following SQL (Password: Admin@12345):
-- INSERT INTO admins (email, password_hash, name)
-- VALUES ('admin@edtech.com', '$2a$10$w3U/d8qU65tFk6s2Ff5kLeK3R87gT0hW7WkPZlqVfH9nJ4X0K2nmi', 'System Admin')
-- ON CONFLICT (email) DO NOTHING;

