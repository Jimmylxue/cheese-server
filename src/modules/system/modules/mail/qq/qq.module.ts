import { Module } from '@nestjs/common';
import { MailController } from './qq.controller';
import { QQNodeMailerService } from './qq.service';
import { MailTemplateService } from './template.service';

@Module({
  providers: [QQNodeMailerService, MailTemplateService],
  controllers: [MailController],
  exports: [QQNodeMailerService],
})
export class MailModule {}
