import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ description: 'Target Folder ID', required: false })
  @IsOptional()
  folderId?: number;
}
