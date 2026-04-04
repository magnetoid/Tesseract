import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[api] DATABASE_URL is not set. Database-backed routes will fail until it is configured.');
}

const pool = new Pool({
  connectionString,
});

pool.on('error', (error) => {
  console.error('[api] unexpected postgres error', error);
});

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

export async function close(): Promise<void> {
  await pool.end();
}

export async function checkHealth(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch (error) {
    console.error('[api] database health check failed', error);
    return false;
  }
}
