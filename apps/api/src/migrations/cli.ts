import dotenv from 'dotenv';
import { close, pool } from '../db.js';
import { runMigrations } from './run.js';

dotenv.config();

async function main(): Promise<void> {
  await runMigrations(pool);
  await close();
}

main().catch((error) => {
  console.error('[migrate] failed', error);
  process.exit(1);
});
