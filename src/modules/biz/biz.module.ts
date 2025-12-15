import { Module } from '@nestjs/common';
import { MemoWordModule } from './memo-word/memo.module';
import { TodoListModule } from './todolist/todolist.module';
@Module({
  imports: [MemoWordModule, TodoListModule],
  providers: [],
  exports: [],
})
export class BizModule {}
