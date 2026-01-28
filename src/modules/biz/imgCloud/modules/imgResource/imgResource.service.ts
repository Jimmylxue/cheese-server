import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ImgResource } from '../../entities/imgResource.entity';
import { ConfigService } from '@nestjs/config';
import { UpyonService } from 'src/modules/system/modules/fileUpload/upyon/upyon.service';
import { ImgResourceResponseDto } from '../../dto/resource-response.dto';

@Injectable()
export class ImgResourceService {
  constructor(
    @InjectRepository(ImgResource)
    private resourceRepository: Repository<ImgResource>,
    private configService: ConfigService,
    private upyonService: UpyonService,
  ) {}

  private toDto(entity: ImgResource): ImgResourceResponseDto {
    return {
      id: entity.id,
      url: entity.url,
      filename: entity.filename,
      size: entity.size || 0,
      mimetype: entity.mimetype || '',
      folderId: entity.folder ? entity.folder.id : null,
      createdAt: entity.createdAt,
    };
  }

  async list(
    userId: number,
    folderId?: number,
  ): Promise<ImgResourceResponseDto[]> {
    const whereImage: any = { user: { id: userId } };

    if (folderId) {
      whereImage.folder = { id: folderId };
    } else {
      whereImage.folder = IsNull();
    }

    const resources = await this.resourceRepository.find({
      where: whereImage,
      relations: ['folder'],
    });

    return resources.map((res) => this.toDto(res));
  }

  async upload(
    file: any,
    userId: number,
    folderId?: number,
  ): Promise<ImgResourceResponseDto> {
    const uploadRes = await this.upyonService.upload(file);
    if (!uploadRes.success || !uploadRes.url) {
      throw new InternalServerErrorException(
        uploadRes.message || 'Upload failed',
      );
    }

    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${safeOriginalName}`;

    console.log('uploadRes', uploadRes);
    console.log('safeOriginalName', safeOriginalName);
    console.log('fileName', fileName);

    const resource = new ImgResource();
    resource.url = uploadRes.url;
    resource.filename = fileName;
    resource.size = file.size;
    resource.mimetype = file.mimetype;
    resource.userId = userId;
    resource.user = { id: userId } as any;

    if (folderId) {
      resource.folder = { id: folderId } as any;
    }

    const saved = await this.resourceRepository.save(resource);

    return this.toDto(saved);
  }

  async getOne(id: number): Promise<ImgResource | null> {
    return this.resourceRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    userId: number,
    filename?: string,
    folderId?: number | null,
  ): Promise<ImgResourceResponseDto> {
    const resource = await this.resourceRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['folder'],
    });

    if (!resource) {
      throw new NotFoundException('Image not found');
    }

    if (filename !== undefined) {
      resource.filename = filename;
    }

    if (folderId !== undefined) {
      if (folderId === null) {
        resource.folder = null as any;
      } else {
        resource.folder = { id: folderId } as any;
      }
    }

    const saved = await this.resourceRepository.save(resource);
    return this.toDto(saved);
  }

  async delete(id: number, userId: number): Promise<void> {
    const resource = await this.resourceRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!resource) {
      throw new NotFoundException('Image not found');
    }
    await this.resourceRepository.remove(resource);
  }
}
