import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsString } from 'class-validator';

export class BingBgDto {
  @ApiProperty({ description: '是否高清图片-字符串布尔值', example: 'true' })
  @IsBooleanString()
  UHD: string;
}

export class loveStatus {
  @IsString()
  background: string;

  @IsString()
  date: string;
}
