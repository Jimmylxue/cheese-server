import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateResourceDto {
  @ApiProperty({ description: 'Resource ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'New Filename', example: 'new_name.jpg', required: false })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiProperty({ description: 'New Folder ID', example: 1, required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  folderId?: number | null;
}
