import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpyonController } from './upyon.controller';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
  controllers: [UpyonController],
})
export class UpyonModule {}
