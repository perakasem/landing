import '@testing-library/jest-dom';

// Set test environment variables
process.env.PUBLIC_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.PUBLIC_SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || 'test-key';
