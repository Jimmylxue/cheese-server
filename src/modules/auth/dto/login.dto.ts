import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginPhoneDto {
  @ApiProperty({ description: '手机号', example: '19905076109' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  password: string;
}

export class RegisterPhoneDto {
  @ApiProperty({ description: '手机号', example: '19905076109' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  password: string;
}
