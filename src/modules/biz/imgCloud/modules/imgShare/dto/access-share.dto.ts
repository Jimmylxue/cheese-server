import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AccessShareDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  code: string;
}
