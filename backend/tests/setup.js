import { vi } from 'vitest';

process.env.DATABASE_URL = 'postgresql://testuser:testpass@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
process.env.JWT_SECRET = 'test_secret_key_for_testing_purposes_only_32_characters';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.FRONTEND_URL = 'http://localhost:5173';

