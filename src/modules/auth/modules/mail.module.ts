import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserModule } from './user.module';
import { MailAuthController } from '../controller/mail.controller';
import { MailAuthService } from '../services/mail.service';
import { MailModule } from 'src/modules/system/modules/mail/qq/qq.module';

@Module({
  imports: [HttpModule, UserModule, MailModule],
  controllers: [MailAuthController],
  providers: [AuthService, MailAuthService],
})
export class MailAuthModule {}
