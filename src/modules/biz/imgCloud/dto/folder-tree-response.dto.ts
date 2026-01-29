import { ApiProperty } from '@nestjs/swagger';

export class FolderTreeResponseDto {
  @ApiProperty({ description: 'Folder ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Folder Name', example: 'My Folder' })
  name: string;

  @ApiProperty({
    description: 'Parent Folder ID',
    example: 1,
    required: false,
    nullable: true,
  })
  parentId: number | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Update timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'Child folders', type: [FolderTreeResponseDto] })
  children: FolderTreeResponseDto[];
}
