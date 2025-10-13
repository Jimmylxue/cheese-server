import { Module } from '@nestjs/common';
import { MemoWordModule } from './memo-word/memo.module';
@Module({
  imports: [MemoWordModule],
  providers: [],
  exports: [],
})
export class BizModule {}
