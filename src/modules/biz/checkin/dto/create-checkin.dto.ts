import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateCheckinDto {
  @ApiProperty({ description: '签到纬度', required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ description: '签到经度', required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;
}
