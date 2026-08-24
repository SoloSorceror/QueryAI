import { Pool } from 'pg';
import { env } from './environment';

/**
 * Main database pool — used for authentication and query history.
 * This user has full CRUD permissions on users and query_history tables.
 */
export const mainPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,              // Maximum 10 connections in the pool
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Fail if can't connect in 10s
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

/**
 * Read-only database pool — used ONLY for AI-generated SQL.
 * 
 * IMPORTANT: For the initial setup, both pools use the same
 * connection string. In Phase 3, we'll create a restricted
 * PostgreSQL role with only SELECT privileges and update this.
 * 
 * For now, we enforce read-only at the application level
 * (SQL validator + BEGIN READ ONLY transaction).
 */
export const readonlyPool = new Pool({
  connectionString: env.DATABASE_URL, // Will be changed to readonly user in Phase 3
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false },
});

/**
 * Helper to test database connectivity on startup.
 * Runs a simple query and logs success/failure.
 */
export async function testConnection(): Promise<void> {
  try {
    const result = await mainPool.query('SELECT NOW() as current_time');
    console.log(`Database connected at ${result.rows[0].current_time}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}
