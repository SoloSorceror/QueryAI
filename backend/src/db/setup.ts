import fs from 'fs';
import path from 'path';
import { mainPool } from '../config/database';

async function setup(): Promise<void> {
  console.log('Setting up database schema...\n');

  try {
    // Read the SQL file
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Execute against database
    await mainPool.query(schemaSql);

    console.log('Database schema created successfully!');
    console.log('Tables: users, query_history, customers, products, orders, order_items');
    console.log('\nNext step: npm run db:seed');
  } catch (error) {
    console.error('Schema setup failed:', error);
    process.exit(1);
  } finally {
    await mainPool.end();
  }
}

setup();
