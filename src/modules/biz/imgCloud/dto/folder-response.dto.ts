import { ApiProperty } from '@nestjs/swagger';

export class ImgFolderResponseDto {
  @ApiProperty({ description: 'Folder ID' })
  id: number;

  @ApiProperty({ description: 'Folder Name' })
  name: string;

  @ApiProperty({
    description: 'Parent Folder ID',
    required: false,
    nullable: true,
  })
  parentId?: number | null;

  @ApiProperty({ description: 'Creation Date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update Date' })
  updatedAt: Date;
}
