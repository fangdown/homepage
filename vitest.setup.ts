// Supabase admin client is constructed at module load in src/lib/supabase.ts.
// Tests that import admin modules need these env vars set before evaluation.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= 'http://127.0.0.1:54321'
process.env.SUPABASE_SERVICE_ROLE_KEY ??= 'vitest-placeholder-service-role-key'
