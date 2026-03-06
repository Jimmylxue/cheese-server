import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeSetting } from '../../entities/noticeSetting.entity';
import { NoticeRun } from '../../entities/noticeRun.entity';
import { NoticeRecord } from '../../entities/noticeRecord.entity';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { Task } from '../../entities/task.entity';
import { MailModule } from 'src/modules/system/modules/mail/qq/qq.module';
import { SendLetterModule } from 'src/modules/system/modules/siteLetter/sendLetter/sendLetter.module';
import { UserModule } from 'src/modules/auth/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticeSetting, NoticeRun, NoticeRecord, Task]),
    MailModule,
    SendLetterModule,
    UserModule,
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
