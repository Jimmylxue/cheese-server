import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [HttpModule],
  providers: [GithubService],
  controllers: [GithubController],
  exports: [GithubService],
})
export class GithubModule {}
