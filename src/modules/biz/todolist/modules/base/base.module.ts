import { Module } from '@nestjs/common';
import { BaseController } from './base.controller';
import { HttpModule } from '@nestjs/axios';
import { BaseService } from './base.service';
import { GithubModule } from 'src/modules/thirdPlatform/github/bingBg.module';

@Module({
  imports: [HttpModule, GithubModule],
  providers: [BaseService],
  controllers: [BaseController],
})
export class BaseModule {}
