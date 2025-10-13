import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsObject, IsString } from 'class-validator';

export class ScanCodeDto {
  @ApiProperty({ description: '二维码id', example: 'uuid' })
  @IsString()
  qr_id: string;
}

export class CheckLoginDto {
  @ApiProperty({ description: '二维码id', example: 'qr_id' })
  @IsString()
  qr_id: string;

  @ApiProperty({ description: '轮询token', example: 'token' })
  @IsString()
  token: string;
}

class GenerateQrCodeResponse {
  @ApiProperty({ description: '二维码图片资源', example: 'qr_svg' })
  @IsString()
  qr_svg: string;

  @ApiProperty({
    description: '这个token给前端轮询用，与qr_id绑定',
    example: 'qr_svg',
  })
  @IsString()
  token: string;

  @ApiProperty({ description: '二维码id', example: 'qr_id' })
  @IsString()
  qr_id: string;
}

export class GenerateQrCodeResponseDto {
  @ApiProperty({
    description: '业务状态码',
    example: 200,
  })
  @IsIn([200, 500])
  code: number;

  @ApiProperty({
    description: '返回内容',
  })
  result: GenerateQrCodeResponse;
}

export class CommonScanCodeResponseDto {
  @ApiProperty({
    description: '业务状态码',
    example: 200,
  })
  @IsIn([200, 500])
  code: number;

  @ApiProperty({
    description: '状态',
    example: true,
  })
  @IsBoolean()
  result: boolean;
}

class CheckLoginResponse {
  @ApiProperty({
    description: '二维码状态：待扫码、已扫码、已确定',
    example: 'pending',
  })
  @IsIn(['pending', 'scanned', 'confirmed'])
  status: string;

  @ApiProperty({ description: '用户id', example: '173117002' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '网页授权登录临时token', example: 'token' })
  @IsString()
  token: string;

  @ApiProperty({ description: '已扫码用户名', example: '吉米' })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '已扫码头像',
    example: 'https://avatars.githubusercontent.com/u/65758455?v=4',
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    description: '扫码授权成功之后的真实用户token',
    example: 'access_token',
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    description: '扫码授权成功之后的真实用户基础信息',
    example: '{}',
  })
  @IsObject()
  user: object;
}

export class CheckLoginResponseDto {
  @ApiProperty({
    description: '业务状态码',
    example: 200,
  })
  @IsIn([200, 500])
  code: number;

  @ApiProperty({
    description: '返回内容',
  })
  result: CheckLoginResponse;
}
