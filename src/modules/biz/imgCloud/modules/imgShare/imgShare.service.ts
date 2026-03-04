import {
  Injectable,
  NotFoundException,
  ForbiddenException,
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
import { ListShareDto } from './dto/list-share.dto';
import { CancelShareDto } from './dto/cancel-share.dto';
import { ShareInfoDto } from './dto/share-info.dto';
import { AccessShareDto } from './dto/access-share.dto';
import { AdminUpdateShareDto } from './dto/admin-update-share.dto';

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

    let token = this.generateToken();
    while (await this.shareRepository.findOne({ where: { token } })) {
      token = this.generateToken();
    }

    let expireAt: Date | null = null;
    if (dto.validity !== ShareValidityPeriod.PERMANENT) {
      expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + dto.validity);
    }

    const share = this.shareRepository.create({
      token,
      type: dto.type,
      userId,
      resourceId: dto.type === ShareType.FILE ? dto.targetId : null,
      folderId: dto.type === ShareType.FOLDER ? dto.targetId : null,
      expireAt,
      accessCode: dto.accessCode,
      resource: dto.type === ShareType.FILE ? { id: dto.targetId } : undefined,
      folder: dto.type === ShareType.FOLDER ? { id: dto.targetId } : undefined,
    });

    await this.shareRepository.save(share);

    const baseUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:5173';

    return {
      shareLink: `${baseUrl}/share/${token}`,
      token,
      expireAt,
      accessCode: dto.accessCode || null,
    };
  }

  async cancelShare(userId: number, dto: CancelShareDto): Promise<boolean> {
    const share = await this.shareRepository.findOne({
      where: { id: dto.id, isDelete: false },
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    if (share.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    share.isDelete = true;
    share.deletedAt = new Date();
    await this.shareRepository.save(share);

    return true;
  }

  async listShares(userId: number, dto: ListShareDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const [result, total] = await this.shareRepository.findAndCount({
      where: { userId, isDelete: false },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      page,
      result,
      total,
    };
  }

  async getShareInfo(dto: ShareInfoDto): Promise<ShareInfoResponseDto> {
    const share = await this.shareRepository.findOne({
      where: { token: dto.token, isDelete: false },
      relations: ['resource', 'folder'],
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    if (share.expireAt && new Date() > share.expireAt) {
      return {
        isValid: false,
        isLocked: false,
        type: share.type,
        creatorId: share.userId,
        expireAt: share.expireAt,
        data: null,
      };
    }

    if (share.accessCode) {
      return {
        isValid: true,
        isLocked: true,
        type: share.type,
        creatorId: share.userId,
        expireAt: share.expireAt,
        data: null,
      };
    }

    const data = this.formatShareData(share);
    return {
      isValid: true,
      isLocked: false,
      type: share.type,
      creatorId: share.userId,
      expireAt: share.expireAt,
      data,
    };
  }

  async accessShare(dto: AccessShareDto) {
    const share = await this.shareRepository.findOne({
      where: { token: dto.token, isDelete: false },
      relations: ['resource', 'folder'],
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    if (share.expireAt && new Date() > share.expireAt) {
      return {
        isValid: false,
        type: share.type,
        data: null,
      };
    }

    if (share.accessCode && share.accessCode !== dto.code) {
      throw new ForbiddenException('Invalid access code');
    }

    const data = this.formatShareData(share);
    return {
      isValid: true,
      type: share.type,
      data,
    };
  }

  private formatShareData(share: ImgShare) {
    if (share.type === ShareType.FILE && share.resource) {
      return {
        id: share.resource.id,
        url: share.resource.url,
        filename: share.resource.filename,
        size: share.resource.size,
        mimetype: share.resource.mimetype,
        createdAt: share.resource.createdAt,
      };
    } else if (share.type === ShareType.FOLDER && share.folder) {
      return {
        id: share.folder.id,
        name: share.folder.name,
        createdAt: share.folder.createdAt,
        updatedAt: share.folder.updatedAt,
      };
    }
    return null;
  }

  async adminListShares(dto: ListShareDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const [result, total] = await this.shareRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      page,
      result,
      total,
    };
  }

  async adminUpdateShare(dto: AdminUpdateShareDto) {
    const share = await this.shareRepository.findOne({ where: { id: dto.id } });
    if (!share) {
      throw new NotFoundException('Share not found');
    }

    if (dto.expireAt !== undefined) {
      share.expireAt = dto.expireAt;
    }

    if (dto.accessCode !== undefined) {
      share.accessCode = dto.accessCode;
    }

    await this.shareRepository.save(share);
    return true;
  }

  async adminDeleteShare(dto: CancelShareDto) {
    const share = await this.shareRepository.findOne({ where: { id: dto.id } });
    if (!share) {
      throw new NotFoundException('Share not found');
    }

    share.isDelete = true;
    share.deletedAt = new Date();
    await this.shareRepository.save(share);
    return true;
  }
}
