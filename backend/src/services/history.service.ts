import { mainPool } from '../config/database';
import type { QueryHistoryItem } from '../types';

export class HistoryService {
  /**
   * Retrieves the query history for a specific user.
   * Orders by most recent first.
   */
  static async getUserHistory(userId: string): Promise<QueryHistoryItem[]> {
    const query = `
      SELECT 
        id, 
        user_id, 
        question, 
        generated_sql, 
        result, 
        insight, 
        created_at 
      FROM query_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC
      LIMIT 50
    `;
    
    const result = await mainPool.query<QueryHistoryItem>(query, [userId]);
    return result.rows;
  }

  /**
   * Retrieves a specific query history item by ID.
   * Verifies that the item belongs to the requested user.
   */
  static async getHistoryItem(id: string, userId: string): Promise<QueryHistoryItem> {
    const query = `
      SELECT 
        id, 
        user_id, 
        question, 
        generated_sql, 
        result, 
        insight, 
        created_at 
      FROM query_history 
      WHERE id = $1 AND user_id = $2
    `;
    
    const result = await mainPool.query<QueryHistoryItem>(query, [id, userId]);
    const item = result.rows[0];

    if (!item) {
      throw new Error('History item not found or you do not have permission to view it');
    }

    return item;
  }
}
