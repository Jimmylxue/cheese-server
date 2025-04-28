import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeChatOfficialController } from './controller/official.controller';
import { WeChatOfficialService } from './services/official.service';
import { WeChatCommonService } from './services/common.service';
@Module({
  imports: [HttpModule],
  controllers: [WeChatOfficialController],
  providers: [WeChatOfficialService, WeChatCommonService],
})
export class WeChatOfficialModule {}
