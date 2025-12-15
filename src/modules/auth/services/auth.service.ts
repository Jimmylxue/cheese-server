// src/modules/auth/services/auth.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorFactory } from 'src/common/exceptions/error.factory';
import { JwtService } from '@nestjs/jwt';
import { LoginPhoneDto, RegisterPhoneDto } from '../dto/login.dto';
import { UsersService } from './user.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signIn(signInDto: LoginPhoneDto): Promise<{ access_token: string }> {
    const user = await this.usersService.getUserByPhone(signInDto.phone);
    if (!user || user.password !== signInDto.password) {
      throw ErrorFactory.invalidCredentials();
    }

    const payload = { userId: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerPhone(registerDto: RegisterPhoneDto) {
    const existingUser = await this.usersService.getUserByPhone(
      registerDto.phone,
    );
    if (existingUser) {
      throw ErrorFactory.userAlreadyExists();
    }

    if (registerDto.password.length < 6) {
      throw ErrorFactory.weakPassword();
    }

    try {
      await this.usersService.createUser(registerDto);
      return {
        code: 200,
        message: '注册成功',
      };
    } catch {
      throw ErrorFactory.custom(
        '注册过程中发生错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createToken(user) {
    const payload = {
      nickname: user.username,
      userId: user.id,
      avatar: user.avatar,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload);
  }

  // 发送验证码
  async sendVerificationCode(phone: string): Promise<boolean> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // 将验证码存储在 Redis 中，设置过期时间为 5 分钟
    await this.redisService.set(`verification_code_${phone}`, code, 300);
    // 这里你可以集成第三方短信服务来发送验证码
    console.log(`发送验证码 ${code} 到手机号 ${phone}`);
    return true;
  }
}
