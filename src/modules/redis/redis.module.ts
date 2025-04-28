import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() // 标记为全局模块，整个应用都可以使用
@Module({
  providers: [RedisService],
  exports: [RedisService], // 导出服务以便其他模块使用
})
export class RedisModule {}
