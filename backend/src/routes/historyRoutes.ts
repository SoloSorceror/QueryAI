import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { HistoryService } from '../services/history.service';
import type { ApiResponse, QueryHistoryItem } from '../types';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const history = await HistoryService.getUserHistory(userId);
    
    const response: ApiResponse<QueryHistoryItem[]> = {
      success: true,
      data: history,
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch history',
    };
    res.status(500).json(response);
  }
});

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    
    const historyItem = await HistoryService.getHistoryItem(id, userId);
    
    const response: ApiResponse<QueryHistoryItem> = {
      success: true,
      data: historyItem,
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch history item',
    };
    res.status(404).json(response);
  }
});

export default router;
