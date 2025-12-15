import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginSuccessResponseDto } from '../dto/miniProgram.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginByMailDto,
  RegisterByMailDto,
  SendMailCodeDto,
  SendMailCodeResponseDto,
} from '../dto/mail.dto';
import { MailAuthService } from '../services/mail.service';

@ApiTags('邮箱登录')
@Controller('mail')
export class MailAuthController {
  constructor(private mailService: MailAuthService) {}

  @ApiOperation({ summary: '邮箱登录' })
  @ApiResponse({
    description: '登录返回',
    type: LoginSuccessResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login_mail')
  async login_mail(@Body() loginByMailDto: LoginByMailDto) {
    return await this.mailService.login_mail(loginByMailDto);
  }

  @ApiOperation({ summary: '邮箱注册' })
  @ApiResponse({
    description: '注册返回',
    type: LoginSuccessResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('register_mail')
  async registerMail(@Body() registerDto: RegisterByMailDto) {
    return await this.mailService.registerMail(registerDto);
  }

  // 实现发送验证码的接口
  @ApiOperation({ summary: '发送邮箱验证码' })
  @ApiResponse({
    description: '发送验证码返回结果',
    type: SendMailCodeResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('send_verification_code')
  async sendVerificationCode(@Body() email: SendMailCodeDto) {
    return await this.mailService.sendVerificationCode(email);
  }
}
