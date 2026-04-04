import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

const redis = createClient({ url: redisUrl });

redis.on('error', (error) => {
  console.error('[api] redis error', error);
});

redis.on('connect', () => {
  console.log('[api] redis connected');
});

export async function connect(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export async function disconnect(): Promise<void> {
  if (redis.isOpen) {
    await redis.disconnect();
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    await connect();
    await redis.ping();
    return true;
  } catch (error) {
    console.error('[api] redis health check failed', error);
    return false;
  }
}

export function getRedisClient() {
  return redis;
}
