import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ShareInfoDto {
  @ApiProperty()
  @IsString()
  token: string;
}
