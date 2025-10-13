import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class BaseResponseDto {
  @ApiProperty({
    description: '业务状态码',
    example: 200,
  })
  @IsIn([200, 500])
  code: number;

  @ApiProperty({
    description: '业务消息',
    example: '操作成功',
  })
  @IsOptional()
  @IsString()
  message: string;
}
