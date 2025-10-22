import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';

@Module({
  imports: [HttpModule],
  providers: [TranslateService],
  controllers: [TranslateController],
})
export class TranslateModule {}
