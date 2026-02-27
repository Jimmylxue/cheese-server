import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ImgShare, ShareType } from '../../entities/imgShare.entity';
import { ImgResource } from '../../entities/imgResource.entity';
import { ImgFolder } from '../../entities/imgFolder.entity';
import { CreateShareDto, ShareValidityPeriod } from './dto/create-share.dto';
import { ShareResponseDto } from './dto/share-response.dto';
import { ShareInfoResponseDto } from './dto/share-info-response.dto';

@Injectable()
export class ImgShareService {
  constructor(
    @InjectRepository(ImgShare)
    private shareRepository: Repository<ImgShare>,
    @InjectRepository(ImgResource)
    private resourceRepository: Repository<ImgResource>,
    @InjectRepository(ImgFolder)
    private folderRepository: Repository<ImgFolder>,
    private readonly configService: ConfigService,
  ) {}

  private generateToken(length = 8): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  async createShare(
    userId: number,
    dto: CreateShareDto,
  ): Promise<ShareResponseDto> {
    // 1. Verify target exists and belongs to user
    if (dto.type === ShareType.FILE) {
      const resource = await this.resourceRepository.findOne({
        where: { id: dto.targetId },
      });
      if (!resource || resource.userId !== userId) {
        throw new NotFoundException('Resource not found or access denied');
      }
    } else {
      const folder = await this.folderRepository.findOne({
        where: { id: dto.targetId },
      });
      if (!folder || folder.userId !== userId) {
        throw new NotFoundException('Folder not found or access denied');
      }
    }

    // 2. Generate Token
    let token = this.generateToken();
    while (await this.shareRepository.findOne({ where: { token } })) {
      token = this.generateToken();
    }

    // 3. Calculate Expiration
    let expireAt: Date | null = null;
    if (dto.validity !== ShareValidityPeriod.PERMANENT) {
      expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + dto.validity);
    }

    // 4. Save
    const share = this.shareRepository.create({
      token,
      type: dto.type,
      userId,
      resourceId: dto.type === ShareType.FILE ? dto.targetId : null,
      folderId: dto.type === ShareType.FOLDER ? dto.targetId : null,
      expireAt,
      resource: dto.type === ShareType.FILE ? { id: dto.targetId } : undefined,
      folder: dto.type === ShareType.FOLDER ? { id: dto.targetId } : undefined,
    });

    await this.shareRepository.save(share);

    // 5. Return response
    const baseUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:5173';

    return {
      shareLink: `${baseUrl}/share/${token}`,
      token,
      expireAt,
    };
  }

  async getShareInfo(token: string): Promise<ShareInfoResponseDto> {
    const share = await this.shareRepository.findOne({
      where: { token },
      relations: ['resource', 'folder'],
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    const now = new Date();
    if (share.expireAt && share.expireAt < now) {
      return {
        isValid: false,
        type: share.type,
        creatorId: share.userId,
        expireAt: share.expireAt,
        data: null,
      };
    }

    let data: any = null;
    if (share.type === ShareType.FILE && share.resource) {
      data = {
        id: share.resource.id,
        url: share.resource.url,
        filename: share.resource.filename,
        size: share.resource.size || 0,
        mimetype: share.resource.mimetype || '',
        createdAt: share.resource.createdAt,
      };
    } else if (share.type === ShareType.FOLDER && share.folder) {
      data = {
        id: share.folder.id,
        name: share.folder.name,
        createdAt: share.folder.createdAt,
        updatedAt: share.folder.updatedAt,
      };
    }

    return {
      isValid: true,
      type: share.type,
      creatorId: share.userId,
      expireAt: share.expireAt,
      data,
    };
  }
}
