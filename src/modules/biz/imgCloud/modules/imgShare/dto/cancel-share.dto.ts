import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CancelShareDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
