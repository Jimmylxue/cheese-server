import { Module } from '@nestjs/common';
import { BingBgController } from './bingBg.controller';
import { BingBgService } from './bingBg.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BingBgService],
  controllers: [BingBgController],
})
export class BingBgModule {}
