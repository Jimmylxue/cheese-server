import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TSendVerificationParams } from './qq.dto';

@Injectable()
export class MailTemplateService {
  constructor(private readonly configService: ConfigService) {}

  getVerificationTemplate({ to, code }: TSendVerificationParams) {
    const AppName = this.configService.get<string>('APP_NAME');
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>${AppName}</title>
    </head>
    <body>
      <div class="mail-box">
        ${to}，您好！ 我已经收到你的要求，本次验证码为<span style="color: red"
          >${code}</span
        >。有效期为10分钟。
        <p>
          如果您没有请求次代码，可忽略这封电子邮件。可能别人错误的输入您的邮件地址。
        </p>
      </div>
      <div>谢谢！</div>
      <p>${AppName}</p>
    </body>
  </html>`;
  }
}
