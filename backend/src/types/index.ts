export interface User {
  id: string;           // UUID from PostgreSQL
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

/** What we send back to the client (no password hash!) */
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

/** What the client sends when registering */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** What the client sends when logging in */
export interface LoginRequest {
  email: string;
  password: string;
}

/** What we store inside the JWT token */
export interface JwtPayload {
  userId: string;
  email: string;
}

// --- Query types ---

/** What the client sends to /api/query */
export interface QueryRequest {
  question: string;
}

/** The full response sent back after AI processing */
export interface QueryResponse {
  question: string;
  sql: string;
  results: Record<string, unknown>[];  // Array of row objects
  insight: string;
  executionTime: number;               // milliseconds
}

/** A single query history entry from the database */
export interface QueryHistoryItem {
  id: string;
  user_id: string;
  question: string;
  generated_sql: string;
  result: Record<string, unknown>[];
  insight: string;
  created_at: Date;
}

// --- API Response wrapper ---

/** 
 * Standard API response shape
 * 
 * Generic <T> means: "this interface works with ANY data type"
 * 
 * Example usage:
 *   ApiResponse<UserResponse>   → { success: true, data: { id, name, email, ... } }
 *   ApiResponse<QueryResponse>  → { success: true, data: { question, sql, ... } }
 * 
 * Without generics, we'd need separate interfaces for every response type.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Express augmentation ---

/**
 * We need to tell TypeScript that our Express Request object
 * has a `user` property (added by our auth middleware).
 * 
 * This is called "declaration merging" — we're EXTENDING
 * Express's built-in types with our own fields.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
