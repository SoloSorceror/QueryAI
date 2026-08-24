import { mainPool } from '../config/database';

export class SchemaService {
  /**
   * Retrieves the database schema structure (tables and columns).
   * This is passed to Gemini so it understands what it can query.
   */
  static async getDatabaseSchema(): Promise<string> {
    const query = `
      SELECT 
        table_name, 
        column_name, 
        data_type 
      FROM 
        information_schema.columns 
      WHERE 
        table_schema = 'public' 
        AND table_name IN ('customers', 'products', 'orders', 'order_items')
      ORDER BY 
        table_name, ordinal_position;
    `;

    const result = await mainPool.query(query);

    let schemaStr = '';
    let currentTable = '';

    for (const row of result.rows) {
      if (currentTable !== row.table_name) {
        if (currentTable !== '') {
          schemaStr += '\n';
        }
        currentTable = row.table_name;
        schemaStr += `Table: ${currentTable}\nColumns:\n`;
      }
      schemaStr += `- ${row.column_name} (${row.data_type})\n`;
    }

    return schemaStr;
  }
}
