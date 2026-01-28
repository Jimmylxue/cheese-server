import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteResourceDto {
  @ApiProperty({ description: 'Resource ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
