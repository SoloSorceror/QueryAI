import { Router } from 'express';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { requireAuth } from '../middleware/auth';
import type { ApiResponse } from '../types';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name, email, and password are required',
      };
      res.status(400).json(response);
      return;
    }

    const data = await AuthService.register({ name, email, password });
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
    };
    res.status(201).json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
    };
    const status = error.message.includes('already registered') ? 409 : 500;
    res.status(status).json(response);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email and password are required',
      };
      res.status(400).json(response);
      return;
    }

    const data = await AuthService.login({ email, password });
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
    };
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
    };
    const status = error.message.includes('Invalid') ? 401 : 500;
    res.status(status).json(response);
  }
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await AuthService.getUserById(userId);
    
    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
    };
    res.status(404).json(response);
  }
});

export default router;
