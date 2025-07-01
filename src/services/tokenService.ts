import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import redisClient from '../config/redis';

interface TokenPayload {
  id: string;
  email: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private redisAvailable: boolean = false;
  private redisCheckAttempted: boolean = false;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'access-secret';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
    this.accessTokenExpiry = '15m'; // 15 minutes
    this.refreshTokenExpiry = '7d'; // 7 days
  }

  private async checkRedisAvailability(): Promise<void> {
    if (this.redisCheckAttempted) {
      return;
    }

    this.redisCheckAttempted = true;

    try {
      // Wait a bit for Redis to connect
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (redisClient.isReady) {
        await redisClient.ping();
        this.redisAvailable = true;
        console.log('Redis is available');
      } else {
        this.redisAvailable = false;
        console.log('Redis is not available, using fallback mode');
      }
    } catch (error) {
      this.redisAvailable = false;
      console.log('Redis is not available, using fallback mode');
    }
  }

  generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.checkRedisAvailability();

    if (!this.redisAvailable) {
      console.log('Redis not available, skipping token storage');
      return;
    }

    try {
      const key = `refresh_token:${userId}`;
      // 7 days in seconds for Redis TTL
      const ttl = 7 * 24 * 60 * 60;
      await redisClient.setEx(key, ttl, refreshToken);
    } catch (error) {
      console.error('Failed to store refresh token in Redis:', error);
      this.redisAvailable = false;
    }
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    await this.checkRedisAvailability();

    if (!this.redisAvailable) {
      console.log('Redis not available, skipping token retrieval');
      return null;
    }

    try {
      const key = `refresh_token:${userId}`;
      return await redisClient.get(key);
    } catch (error) {
      console.error('Failed to get refresh token from Redis:', error);
      this.redisAvailable = false;
      return null;
    }
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.checkRedisAvailability();

    if (!this.redisAvailable) {
      console.log('Redis not available, skipping token removal');
      return;
    }

    try {
      const key = `refresh_token:${userId}`;
      await redisClient.del(key);
    } catch (error) {
      console.error('Failed to remove refresh token from Redis:', error);
      this.redisAvailable = false;
    }
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  generateRandomToken(): string {
    return randomBytes(32).toString('hex');
  }

  isRedisAvailable(): boolean {
    return this.redisAvailable;
  }
}

export default new TokenService();
