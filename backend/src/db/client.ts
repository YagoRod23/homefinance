import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/homefinance',
});

export const db = drizzle(pool, { schema });

export async function initializeDatabase() {
  try {
    // Test connection
    const result = await pool.query('SELECT 1');
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export { pool };
