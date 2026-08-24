import { AiService } from './ai.service';
import { SchemaService } from './schema.service';
import { SqlValidatorService } from './validator.service';
import { readonlyPool, mainPool } from '../config/database';
import type { QueryResponse } from '../types';

export class QueryService {
  /**
   * Main orchestration method for the AI Query Pipeline.
   */
  static async processQuery(question: string, userId: string): Promise<QueryResponse> {
    const startTime = Date.now();

    // 1. Get database schema for context
    const schema = await SchemaService.getDatabaseSchema();

    // 2. Generate SQL using Gemini
    const generatedSql = await AiService.generateSql(question, schema);

    // 3. Validate the generated SQL
    const validation = SqlValidatorService.validate(generatedSql);
    if (!validation.isValid) {
      throw new Error(`SQL Validation failed: ${validation.error}`);
    }

    // 4. Execute the query using the read-only pool
    let results: any[];
    const client = await readonlyPool.connect();
    
    try {
      // Layer 2 Security: Explicitly start a read-only transaction
      await client.query('BEGIN READ ONLY');
      const queryResult = await client.query(generatedSql);
      results = queryResult.rows;
      await client.query('COMMIT');
    } catch (error: any) {
      await client.query('ROLLBACK');
      throw new Error(`Database execution failed: ${error.message}`);
    } finally {
      client.release();
    }

    // 5. Generate business insight from the results
    const insight = await AiService.generateInsight(question, results);

    // 6. Save to history (using main pool, asynchronously)
    this.saveHistory(userId, question, generatedSql, results, insight).catch(err => {
      console.error('Failed to save query history:', err);
    });

    const executionTime = Date.now() - startTime;

    return {
      question,
      sql: generatedSql,
      results,
      insight,
      executionTime
    };
  }

  /**
   * Saves the query to the user's history
   */
  private static async saveHistory(
    userId: string,
    question: string,
    sql: string,
    results: any[],
    insight: string
  ): Promise<void> {
    // Only store up to 10 rows in history to save space, but keeping the full structure
    const truncatedResults = results.length > 10 ? results.slice(0, 10) : results;

    await mainPool.query(
      `INSERT INTO query_history (user_id, question, generated_sql, result, insight)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, question, sql, JSON.stringify(truncatedResults), insight]
    );
  }
}
