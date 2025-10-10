// src/redis/redis.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
      // 其他 Redis 配置项...
    });
    this.redisClient.on('error', (err) =>
      console.error('Redis connection error:', err),
    );
    this.redisClient.on('connect', () =>
      console.log('Redis connected successfully'),
    );
  }

  onModuleDestroy() {
    this.redisClient?.disconnect();
  }

  getClient(): Redis {
    return this.redisClient;
  }

  // 封装常用方法
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.setex(key, ttl, stringValue);
    } else {
      await this.redisClient.set(key, stringValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  // 其他 Redis 操作方法...
}
