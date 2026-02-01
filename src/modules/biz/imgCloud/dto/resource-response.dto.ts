import { ApiProperty } from '@nestjs/swagger';

export class ImgResourceResponseDto {
  @ApiProperty({ description: 'Image ID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  url: string;

  @ApiProperty({ description: 'Filename', example: 'image.jpg' })
  filename: string;

  @ApiProperty({ description: 'File size in bytes', example: 1024 })
  size: number;

  @ApiProperty({ description: 'MIME type', example: 'image/jpeg' })
  mimetype: string;

  @ApiProperty({
    description: 'Folder ID',
    example: 1,
    required: false,
    nullable: true,
  })
  folderId: number | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Is Deleted', example: false })
  isDelete: boolean;

  @ApiProperty({ description: 'Is Favorite', example: false })
  isFavorite: boolean;
}
