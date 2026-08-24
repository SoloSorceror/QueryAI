import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import type { JwtPayload, ApiResponse } from '../types';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // 1. Get the Authorization header (format: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unauthorized: No token provided',
    };
    res.status(401).json(response);
    return;
  }

  // 2. Extract just the token part
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using our secret
    // This will throw an error if the token is invalid or expired
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // 4. Attach the decoded payload (userId, email) to the request object
    req.user = decoded;

    // 5. Continue to the actual route handler
    next();
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Unauthorized: Invalid or expired token',
    };
    res.status(401).json(response);
    return;
  }
}
