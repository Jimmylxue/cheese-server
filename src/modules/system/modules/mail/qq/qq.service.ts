import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailTemplateService } from './template.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { generateRandomCode } from 'src/utils';
import { keyMap, KeyType } from './biz';
const nodemailer = require('nodemailer');

@Injectable()
export class QQNodeMailerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailTemplateService: MailTemplateService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 发送验证码
   *  会将码保存至redis
   */
  async sendVerificationCode(
    params: {
      to: string;
    },
    type: KeyType,
  ) {
    const code = generateRandomCode();
    const key = `${keyMap[type]}-${params.to}`;
    await this.redisService.set(key, code, 600); // 600S 后自动删除

    const appName = this.configService.get<string>('APP_NAME');
    const { to } = params;
    return new Promise((resolve) => {
      const host = this.configService.get('QQ_MAIL_HOST');
      const port = this.configService.get('QQ_MAIL_PORT');
      const secure = Boolean(Number(this.configService.get('QQ_MAIL_SECURE')));
      const user = this.configService.get('QQ_MAIL_USER');
      const password = this.configService.get('QQ_MAIL_PASSWORD');
      if (!user || !password || !to) {
        return;
      }
      const html = this.mailTemplateService.getVerificationTemplate(
        {
          ...params,
        },
        code,
      );

      nodemailer
        .createTransport({
          host, // 设置服务
          port, // 端口
          secure, // 是否使用TLS，true，端口为465，否则其他或者568
          auth: {
            // 用户名和密码/授权码
            user,
            pass: password,
          },
        })
        .sendMail(
          {
            from: `${appName} <${user}>`, // 发送邮箱
            to: to, //接收邮箱
            subject: '您的一次性验证码', //标题
            html, //内容
          },
          (err, info) => {
            if (err) {
              console.error(`对${to}邮件发送失败！`, err);
              resolve(false);
              return;
            }
            console.log(`对${to}邮件发送成功！`, info);
            resolve(true);
          },
        );
    });
  }
}
