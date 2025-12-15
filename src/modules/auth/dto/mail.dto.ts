import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginByMailDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  mail: string;
}

export class RegisterByMailDto {
  @IsNotEmpty()
  @IsString()
  mail: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  code?: string;
}

export class SendMailCodeDto {
  @ApiProperty({ description: '邮箱地址', example: '1002661758@qq.com' })
  @IsString()
  mail: string;
}

export class SendMailCodeResponseDto {
  @ApiProperty({
    description: '业务状态码',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: '发送结果',
    example: true,
  })
  result: boolean;

  @ApiProperty({
    description: '提示信息',
    example: '验证码发送成功',
  })
  message: string;
}
