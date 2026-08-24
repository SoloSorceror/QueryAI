import dotenv from 'dotenv';
import path from 'path';

// Load .env from the project root (one level up from backend/)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// List of required environment variables
const REQUIRED_VARS = [
  'DATABASE_URL',
  'GEMINI_API_KEY',
  'JWT_SECRET',
] as const;
// "as const" makes this a readonly tuple of literal types
// TypeScript knows the exact strings, not just "string[]"

// Validate all required vars exist
for (const varName of REQUIRED_VARS) {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

// Export typed environment config
// The "!" (non-null assertion) tells TypeScript:
// "I've already checked this isn't undefined above, trust me"
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
// "as const" here makes all properties readonly
// So you can't accidentally do: env.PORT = 9999
