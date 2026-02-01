import { Injectable } from '@nestjs/common';
import { ImgFolderService } from './modules/imgFolder/imgFolder.service';
import { ImgResourceService } from './modules/imgResource/imgResource.service';
import { ImgCloudListResponseDto } from './dto/cloud-list-response.dto';
import { ImgResourceResponseDto } from './dto/resource-response.dto';

@Injectable()
export class ImgCloudService {
  constructor(
    private readonly imgFolderService: ImgFolderService,
    private readonly imgResourceService: ImgResourceService,
  ) {}

  async list(
    userId: number,
    folderId?: number,
  ): Promise<ImgCloudListResponseDto> {
    const [folders, images] = await Promise.all([
      this.imgFolderService.list(userId, folderId),
      this.imgResourceService.list(userId, folderId),
    ]);

    return {
      folders,
      images,
    };
  }

  async listTrash(userId: number): Promise<ImgResourceResponseDto[]> {
    return this.imgResourceService.listTrash(userId);
  }
}
