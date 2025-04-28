import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PayParamsDto {
  @ApiProperty({ example: 1, description: '猫咪的年龄' })
  @IsString()
  url: string;
}

export class PayNotifyDto {
  @ApiProperty({ example: 1, description: '猫咪的姓名' })
  @IsString()
  name: string;
}
