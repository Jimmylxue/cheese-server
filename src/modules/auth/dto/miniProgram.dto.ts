import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDto } from './login.dto';

export class LoginByMiniProgram {
  @ApiProperty({
    description: '微信小程序登录临时code',
    example: '0c3pFg000TeY6V1eor1006W71v3pFg0r',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

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

class LoginByMiniProgramResponse {
  @ApiProperty({
    description: 'token',
    example: 'xxxxx',
  })
  @IsOptional()
  @IsString()
  token: string;

  @ApiProperty({
    description: '用户返回对象信息',
  })
  @IsOptional()
  @IsString()
  user: UserDto;
}

export class LoginSuccessResponseDto {
  @ApiProperty({
    description: '业务状态码',
    example: 200,
  })
  @IsIn([200, 500])
  code: number;

  @ApiProperty({
    description: '返回内容',
  })
  result: LoginByMiniProgramResponse;
}
