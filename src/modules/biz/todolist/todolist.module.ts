import { Module } from '@nestjs/common';
import { TaskModule } from './modules/task/task.module';
import { TaskTypeModule } from './modules/taskType/taskType.module';
import { BaseModule } from './modules/base/base.module';
import { NoticeModule } from './modules/notice/notice.module';

@Module({
  imports: [TaskTypeModule, TaskModule, BaseModule, NoticeModule],
  providers: [],
  controllers: [],
})
export class TodoListModule {}
