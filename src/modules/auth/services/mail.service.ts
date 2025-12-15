import { Injectable } from '@nestjs/common';
import { UsersService } from './user.service';
import { isQQMail } from 'src/utils';
import { RedisService } from 'src/modules/redis/redis.service';
import {
  LoginByMailDto,
  RegisterByMailDto,
  SendMailCodeDto,
} from '../dto/mail.dto';
import { AuthService } from './auth.service';
import { QQNodeMailerService } from 'src/modules/system/modules/mail/qq/qq.service';

@Injectable()
export class MailAuthService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private readonly redisService: RedisService,
    private readonly qqNodeMailerService: QQNodeMailerService,
  ) {}

  async login_mail(loginByMailDto: LoginByMailDto) {
    const { mail, code } = loginByMailDto;
    if (!isQQMail(mail)) {
      return { code: 500, message: '邮箱格式不正确 - 不是qq邮箱' };
    }

    const user = await this.usersService.getUserByMail(mail);
    if (!user) {
      return {
        code: 500,
        result: '该邮箱未创建用户，请检查地址，或为该邮箱注册一个用户',
      };
    }
    const redisCode = await this.redisService.getMailVerificationCode(mail);
    if (redisCode !== code.toUpperCase()) {
      return {
        code: 500,
        result: '验证码校验失败，请重新发送验证码进行校验',
      };
    }
    if (redisCode) {
      await this.redisService.delMailVerificationCode(mail);
    }

    return {
      code: 200,
      result: {
        user,
        token: await this.authService.createToken(user),
      },
      message: '登录成功',
    };
  }

  async registerMail(registerDto: RegisterByMailDto) {
    const { mail, code, ...args } = registerDto;

    if (!isQQMail(mail)) {
      return { code: 500, result: '邮箱格式不正确 - 不是qq邮箱' };
    }

    const existingUser = await this.usersService.getUserByMail(mail);
    if (existingUser) {
      return {
        code: 500,
        result: '该邮箱已被注册',
      };
    }

    const redisCode = await this.redisService.getMailVerificationCode(mail);

    if (redisCode !== code!.toUpperCase()) {
      return {
        code: 500,
        result: '验证码校验失败，请重新发送验证码进行校验',
      };
    }

    if (redisCode) {
      await this.redisService.delMailVerificationCode(mail);
    }

    await this.usersService.createUserByMail({
      mail,
      ...args,
    });

    const user = await this.usersService.getUserByMail(mail);

    return {
      code: 200,
      result: {
        user,
        token: await this.authService.createToken(user),
      },
      message: '登录成功',
    };
  }

  async sendVerificationCode(email: SendMailCodeDto) {
    const mail = email.mail;
    // 将验证码存储在 Redis 中，设置过期时间为 5 分钟
    const status = await this.qqNodeMailerService.sendVerificationCode(
      {
        to: mail,
      },
      'register',
    );
    if (status) {
      return {
        code: 200,
        message: '发送成功',
      };
    } else {
      return {
        code: 500,
        message: '发送失败，请检查',
      };
    }
  }
}
