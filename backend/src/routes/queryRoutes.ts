import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { QueryService } from '../services/query.service';
import type { ApiResponse, QueryResponse } from '../types';

const router = Router();

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    
    const userId = req.user!.userId;

    if (!question) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Question is required',
      };
      res.status(400).json(response);
      return;
    }

    const data = await QueryService.processQuery(question, userId);
    
    const response: ApiResponse<QueryResponse> = {
      success: true,
      data,
    };
    
    res.json(response);
  } catch (error: any) {
    console.error('Query processing error:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'An error occurred while processing the query',
    };
    
    const status = error.message.includes('Validation failed') ? 400 : 500;
    res.status(status).json(response);
  }
});

export default router;
