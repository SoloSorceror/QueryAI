import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mainPool } from '../config/database';
import { env } from '../config/environment';
import type { RegisterRequest, LoginRequest, User, UserResponse, JwtPayload } from '../types';

export class AuthService {
  /**
   * Generates a JWT token for a given user ID and email
   */
  private static generateToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email };
    // Token expires in 24 hours
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });
  }

  /**
   * Helper to strip out the password_hash before returning to client
   */
  private static sanitizeUser(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };
  }

  /**
   * Registers a new user
   */
  static async register(data: RegisterRequest): Promise<{ token: string; user: UserResponse }> {
    const { name, email, password } = data;

    // 1. Check if user already exists
    const checkResult = await mainPool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkResult.rows.length > 0) {
      throw new Error('Email is already registered');
    }

    // 2. Hash the password (cost factor 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insert into database
    const insertResult = await mainPool.query<User>(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, passwordHash]
    );
    const newUser = insertResult.rows[0];

    // 4. Generate token and return
    const token = this.generateToken(newUser.id, newUser.email);
    return { token, user: this.sanitizeUser(newUser) };
  }

  /**
   * Authenticates an existing user
   */
  static async login(data: LoginRequest): Promise<{ token: string; user: UserResponse }> {
    const { email, password } = data;

    // 1. Find the user
    const result = await mainPool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 3. Generate token and return
    const token = this.generateToken(user.id, user.email);
    return { token, user: this.sanitizeUser(user) };
  }

  /**
   * Gets user by ID (used by the /me endpoint to verify sessions)
   */
  static async getUserById(id: string): Promise<UserResponse> {
    const result = await mainPool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }
}
