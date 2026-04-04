import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient } from 'redis';

dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
});

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const concurrency = Number.parseInt(process.env.WORKER_CONCURRENCY ?? '5', 10);
const pollIntervalMs = Number.parseInt(process.env.WORKER_POLL_INTERVAL_MS ?? '5000', 10);

let shuttingDown = false;

async function reservePendingTasks(limit: number) {
  const result = await db.query<{ id: string }>(
    `WITH candidates AS (
       SELECT id
       FROM ai_tasks
       WHERE status = 'pending'
       ORDER BY created_at ASC
       LIMIT $1
       FOR UPDATE SKIP LOCKED
     )
     UPDATE ai_tasks AS tasks
     SET status = 'processing', updated_at = NOW()
     FROM candidates
     WHERE tasks.id = candidates.id
     RETURNING tasks.id`,
    [limit],
  );

  return result.rows.map((row) => row.id);
}

async function processTask(taskId: string) {
  try {
    const result = await db.query<{
      id: string;
      task_type: string;
      prompt: string;
    }>('SELECT id, task_type, prompt FROM ai_tasks WHERE id = $1', [taskId]);

    if (result.rows.length === 0) {
      return;
    }

    const task = result.rows[0];
    const preview = task.prompt.slice(0, 80);
    console.log(`[worker] processing ${task.id} (${task.task_type}) :: ${preview}`);

    const mockResult = {
      provider: process.env.GEMINI_API_KEY ? 'gemini-configured' : 'mock',
      summary: `Queued ${task.task_type} task processed by foundation worker skeleton.`,
      promptPreview: preview,
      completedAt: new Date().toISOString(),
    };

    await db.query(
      `UPDATE ai_tasks
       SET status = 'completed', result = $2, updated_at = NOW()
       WHERE id = $1`,
      [taskId, JSON.stringify(mockResult)],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[worker] failed task ${taskId}`, error);

    await db.query(
      `UPDATE ai_tasks
       SET status = 'failed', error = $2, updated_at = NOW()
       WHERE id = $1`,
      [taskId, message],
    );
  }
}

async function tick() {
  const taskIds = await reservePendingTasks(concurrency);

  if (taskIds.length === 0) {
    return;
  }

  console.log(`[worker] claimed ${taskIds.length} task(s)`);
  await Promise.all(taskIds.map((taskId) => processTask(taskId)));
}

async function loop() {
  while (!shuttingDown) {
    try {
      await tick();
    } catch (error) {
      console.error('[worker] poll loop error', error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}

async function main() {
  try {
    console.log('[worker] starting torsor worker...');
    console.log(`[worker] concurrency=${concurrency} pollIntervalMs=${pollIntervalMs}`);

    await redis.connect();
    await db.query('SELECT 1');

    console.log('[worker] postgres connected');
    console.log('[worker] redis connected');

    void redis.subscribe('torsor:jobs', async () => {
      if (!shuttingDown) {
        await tick();
      }
    });

    await loop();
  } catch (error) {
    console.error('[worker] fatal error', error);
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`[worker] ${signal} received, shutting down...`);
  await redis.disconnect();
  await db.end();
  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

void main();
