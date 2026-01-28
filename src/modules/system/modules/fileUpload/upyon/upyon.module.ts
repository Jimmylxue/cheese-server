import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpyonController } from './upyon.controller';
import { UpyonService } from './upyon.service';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, UpyonService],
  controllers: [UpyonController],
  exports: [UpyonService],
})
export class UpyonModule {}
