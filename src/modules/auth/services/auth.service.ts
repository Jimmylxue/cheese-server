// src/modules/auth/services/auth.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorFactory } from 'src/common/exceptions/error.factory';
import { JwtService } from '@nestjs/jwt';
import { LoginPhoneDto, RegisterPhoneDto } from '../dto/login.dto';
import { UsersService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
}
