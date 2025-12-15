import { Body, Controller, Post } from '@nestjs/common';
import { SendMailDto } from './qq.dto';
import { generateRandomCode, isQQMail } from 'src/utils';
import { QQNodeMailerService } from './qq.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Controller('mail')
export class MailController {
  constructor(
    private readonly nodemailerService: QQNodeMailerService,
    private readonly redisService: RedisService,
  ) {}

  // @Post('send_verification_code')
  // async send(@Body() body: SendMailDto) {
  //   const { mail } = body;
  //   if (!isQQMail(mail)) {
  //     return { code: 500, message: '邮箱格式不正确 - 不是qq邮箱' };
  //   }
  //   const code = generateRandomCode();
  //   const key = `snow-server-mail-verification-code-${mail}`;
  //   await this.redisService.set(key, code, 600); // 600S 后自动删除
  //   const status = await this.nodemailerService.sendVerificationCode({
  //     to: mail,
  //     code,
  //   });
  //   if (status) {
  //     return { code: 200, message: '发送成功' };
  //   } else {
  //     return { code: 500, message: '发送失败，请检查' };
  //   }
  // }
}
