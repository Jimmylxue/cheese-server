import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteFolderDto {
  @ApiProperty({ description: 'Folder ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
