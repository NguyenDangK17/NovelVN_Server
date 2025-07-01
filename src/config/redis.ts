import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log('Redis connection failed after 10 retries, continuing without Redis');
        return false;
      }
      return Math.min(retries * 100, 3000);
    },
    connectTimeout: 5000
  }
});

redisClient.on('error', (err: Error) => {
  // Only log if it's not a connection refused error (which is expected when Redis is not running)
  if (!err.message.includes('ECONNREFUSED') && !err.message.includes('ENOTFOUND')) {
    console.error('Redis Client Error:', err);
  }
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('end', () => {
  console.log('Redis connection ended');
});

// Connect to Redis
const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log('Failed to connect to Redis, continuing without Redis support');
    // Don't throw error - allow app to continue without Redis
  }
};

// Initialize Redis connection
connectRedis();

export default redisClient; 