import cors from 'cors';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';

import { checkHealth as checkDatabaseHealth, query } from './db.js';
import { healthCheck as checkRedisHealth, connect as connectRedis, getRedisClient } from './redis.js';

dotenv.config();

const app = express();
const port = Number.parseInt(process.env.PORT ?? process.env.API_PORT ?? '3001', 10);
const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
const corsOrigin = process.env.CORS_ORIGIN ?? appUrl;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'torsor-api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', async (_req, res) => {
  const [database, redis] = await Promise.all([checkDatabaseHealth(), checkRedisHealth()]);
  const ready = database && redis;

  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'degraded',
    timestamp: new Date().toISOString(),
    dependencies: { database, redis },
  });
});

app.get('/api/v1', (_req, res) => {
  res.json({
    name: 'torsor-api',
    version: 'v1',
    appUrl,
    endpoints: {
      health: '/health',
      ready: '/ready',
      projects: '/api/v1/projects',
      tasks: '/api/v1/tasks',
      config: '/api/v1/config',
    },
  });
});

app.get('/api/v1/config', (_req, res) => {
  res.json({
    appUrl,
    apiUrl: process.env.VITE_API_URL ?? `http://localhost:${port}`,
    features: {
      auth: process.env.SUPABASE_URL ? 'supabase-compatible-planned' : 'planned',
      projects: 'skeleton',
      backgroundJobs: 'skeleton',
    },
    supabase: {
      configured: Boolean(process.env.SUPABASE_URL),
      url: process.env.SUPABASE_URL ?? null,
    },
  });
});

app.get('/api/v1/projects', async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, description, vibe, is_public, created_at, updated_at
       FROM projects
       ORDER BY created_at DESC
       LIMIT 20`,
    );

    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/tasks', async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT id, project_id, task_type, status, prompt, result, error, created_at, updated_at
       FROM ai_tasks
       ORDER BY created_at DESC
       LIMIT 20`,
    );

    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/tasks', async (req, res, next) => {
  try {
    const { projectId, prompt, taskType = 'generate' } = req.body as {
      projectId?: string;
      prompt?: string;
      taskType?: string;
    };

    if (!projectId || !prompt) {
      res.status(400).json({ error: 'projectId and prompt are required' });
      return;
    }

    const result = await query(
      `INSERT INTO ai_tasks (project_id, task_type, prompt, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, project_id, task_type, status, prompt, created_at, updated_at`,
      [projectId, taskType, prompt],
    );

    const task = result.rows[0];

    try {
      await getRedisClient().publish('torsor:jobs', JSON.stringify({ taskId: task.id }));
    } catch {
      // Polling worker still works even if pub/sub is unavailable.
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error('[api] error', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? message : undefined,
  });
});

async function start() {
  try {
    await connectRedis();
    await query('SELECT 1');

    app.listen(port, '0.0.0.0', () => {
      console.log(`✓ Torsor API running on http://0.0.0.0:${port}`);
      console.log(`  Health: http://localhost:${port}/health`);
      console.log(`  Ready: http://localhost:${port}/ready`);
    });
  } catch (error) {
    console.error('[api] failed to start', error);
    process.exit(1);
  }
}

void start();
