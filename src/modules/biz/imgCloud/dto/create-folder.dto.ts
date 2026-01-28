import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ description: 'Folder Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Parent Folder ID', required: false })
  @IsOptional()
  parentId?: number;
}
