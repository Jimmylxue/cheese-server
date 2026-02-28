import { Module } from '@nestjs/common';
import { MemoWordModule } from './memo-word/memo.module';
import { TodoListModule } from './todolist/todolist.module';
import { ImgCloudModule } from './imgCloud/imgCloud.module';
import { CheckinModule } from './checkin/checkin.module';

@Module({
  imports: [MemoWordModule, TodoListModule, ImgCloudModule, CheckinModule],
  providers: [],
  exports: [],
})
export class BizModule {}
