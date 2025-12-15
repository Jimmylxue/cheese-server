import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({ description: 'openid', example: 'openid' })
  @IsOptional()
  @IsString()
  openid: string;
}

export class RegisterMiniProgramDto {
  @ApiProperty({ description: 'openid', example: 'openid' })
  @IsOptional()
  @IsString()
  openid: string;

  @ApiProperty({ description: '昵称', example: '吉米' })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '头像',
    example: 'https://avatars.githubusercontent.com/u/65758455?v=4',
  })
  @IsOptional()
  @IsString()
  avatar: string;
}

export class UserDto {
  @ApiProperty({
    description: 'id',
    example: 173117001,
  })
  id: number;

  @ApiProperty({
    description: 'openid',
    example: 'openid',
  })
  openid: number;

  @ApiProperty({
    description: '用户名（主要用于登录）',
    example: 'jimmy',
  })
  username: number;

  @ApiProperty({
    description: '昵称',
    example: '吉米',
  })
  nickname: number;

  @ApiProperty({
    description: '头像',
    example: 'https://avatars.githubusercontent.com/u/65758455?v=4',
  })
  avatar: number;

  @ApiProperty({
    description: '角色',
  })
  role: number;

  @ApiProperty({
    description: '手机号',
    example: '19988887777',
  })
  phone: number;

  @ApiProperty({
    description: '邮箱',
    example: '1002661758@qq.com',
  })
  mail: number;
}
