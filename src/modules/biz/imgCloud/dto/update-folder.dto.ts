import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({ description: 'Folder ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Folder Name', example: 'My Folder' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Parent Folder ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
