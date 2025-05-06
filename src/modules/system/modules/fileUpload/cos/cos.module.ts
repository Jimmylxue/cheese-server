import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CosController } from './cos.controller';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
  controllers: [CosController],
})
export class CosModule {}
