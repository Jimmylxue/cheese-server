import { Module } from '@nestjs/common';
import { WordModule } from './word/word.module';
import { TranslateModule } from './translate/translate.module';

@Module({
  imports: [WordModule, TranslateModule],
  providers: [],
  controllers: [],
})
export class MemoWordModule {}
