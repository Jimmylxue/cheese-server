import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guard/auth.guard';
import { LoginPhoneDto, RegisterPhoneDto } from '../dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('手机登录')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '手机号登录' })
  @HttpCode(HttpStatus.OK)
  @Post('login_phone')
  async signIn(@Body() signInDto: LoginPhoneDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: '手机号注册' })
  @HttpCode(HttpStatus.OK)
  @Post('register_phone')
  async registerPhone(@Body() registerDto: RegisterPhoneDto) {
    return await this.authService.registerPhone(registerDto);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(
    @Request()
    req: ExpressRequest & { user: { sub: number; username: string } },
  ) {
    return req.user;
  }
}
