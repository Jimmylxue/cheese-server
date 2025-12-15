import { Module } from '@nestjs/common';
import { TranslateModule } from './translate/translate.module';
import { BingBgModule } from './bingBg/bingBg.module';
import { GithubModule } from './github/bingBg.module';

@Module({
  imports: [TranslateModule, BingBgModule, GithubModule],
  providers: [],
  controllers: [],
})
export class ThirdPlatformModule {}
