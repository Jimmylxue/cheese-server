import { ApiProperty } from '@nestjs/swagger';
import { ImgFolderResponseDto } from './folder-response.dto';
import { ImgResourceResponseDto } from './resource-response.dto';

export class ImgCloudListResponseDto {
  @ApiProperty({ description: 'List of folders', type: [ImgFolderResponseDto] })
  folders: ImgFolderResponseDto[];

  @ApiProperty({
    description: 'List of images',
    type: [ImgResourceResponseDto],
  })
  images: ImgResourceResponseDto[];
}
