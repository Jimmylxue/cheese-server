import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FavoriteSourceDto {
  @ApiProperty({ description: 'Source ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
