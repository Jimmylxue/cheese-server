import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListDto {
  @ApiProperty({ description: 'Folder ID', required: false })
  @IsOptional()
  folderId?: number;
}
