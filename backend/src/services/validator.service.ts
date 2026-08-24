export class SqlValidatorService {
  /**
   * Validates if a generated SQL query is safe to execute.
   * We use a strict allowlist approach: only SELECT statements are allowed.
   */
  static validate(sql: string): { isValid: boolean; error?: string } {
    if (!sql) {
      return { isValid: false, error: 'Query is empty' };
    }

    const upperSql = sql.toUpperCase().trim();

    // Must start with SELECT
    if (!upperSql.startsWith('SELECT')) {
      return { isValid: false, error: 'Only SELECT queries are allowed.' };
    }

    // Blocklist of dangerous keywords
    const blockedKeywords = [
      'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE',
      'CREATE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE'
    ];

    for (const keyword of blockedKeywords) {
      // Use regex to match whole words only to avoid false positives (e.g. DROP in a string)
      const regex = new RegExp(`\\b${keyword}\\b`);
      if (regex.test(upperSql)) {
        return { isValid: false, error: `The keyword '${keyword}' is not allowed.` };
      }
    }

    // Block multiple statements
    if (sql.includes(';')) {
      // Only allow a semicolon at the very end
      if (sql.indexOf(';') !== sql.length - 1 && sql.indexOf(';') !== sql.trim().length - 1) {
        return { isValid: false, error: 'Multiple statements are not allowed.' };
      }
    }

    return { isValid: true };
  }
}
