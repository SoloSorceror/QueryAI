import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/environment';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
// We use a modern Gemini flash model for speed and good reasoning.
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

export class AiService {
  /**
   * Translates a natural language question into a PostgreSQL query.
   */
  static async generateSql(question: string, schema: string): Promise<string> {
    const prompt = `
      You are an expert PostgreSQL database engineer.
      I will give you a database schema and a question.
      Your task is to write a PostgreSQL query that answers the question.
      
      Rules:
      1. ONLY return the SQL query. Do not wrap it in markdown blockquotes (e.g., no \`\`\`sql).
      2. Do not include any explanations or extra text.
      3. The query MUST be a SELECT statement.
      4. Use standard PostgreSQL syntax.

      Schema:
      ${schema}

      Question: ${question}
    `;

    const result = await model.generateContent(prompt);
    let sql = result.response.text().trim();
    
    // Clean up markdown if the model hallucinates it despite instructions
    if (sql.startsWith('\`\`\`sql')) {
      sql = sql.replace(/^\`\`\`sql/, '').replace(/\`\`\`$/, '').trim();
    } else if (sql.startsWith('\`\`\`')) {
      sql = sql.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    return sql;
  }

  /**
   * Explains the results of the query in plain English.
   */
  static async generateInsight(question: string, sqlData: any[]): Promise<string> {
    const prompt = `
      You are a business analyst.
      The user asked: "${question}"
      The database returned the following JSON result:
      ${JSON.stringify(sqlData.slice(0, 50))} // Limit to 50 rows to prevent context window bloat

      Provide a concise, 1-2 sentence business insight based on this data.
      Do not explain how you got the answer, just give the insight.
      Make it sound professional.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }
}
