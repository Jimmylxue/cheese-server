import { Module } from '@nestjs/common';
import { TranslateModule } from './translate/translate.module';
import { BingBgModule } from './bingBg/bingBg.module';

@Module({
  imports: [TranslateModule, BingBgModule],
  providers: [],
  controllers: [],
})
export class ThirdPlatformModule {}
