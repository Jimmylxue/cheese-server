import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ImgFolder } from '../../entities/imgFolder.entity';
import { ImgFolderResponseDto } from '../../dto/folder-response.dto';

@Injectable()
export class ImgFolderService {
  constructor(
    @InjectRepository(ImgFolder)
    private folderRepository: Repository<ImgFolder>,
  ) {}

  private toDto(entity: ImgFolder): ImgFolderResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      parentId: entity.parent ? entity.parent.id : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async create(
    name: string,
    userId: number,
    parentId?: number,
  ): Promise<ImgFolderResponseDto> {
    const folder = this.folderRepository.create({
      name,
      user: { id: userId },
      parent: parentId ? { id: parentId } : undefined,
    });
    const saved = await this.folderRepository.save(folder);
    return {
      id: saved.id,
      name: saved.name,
      parentId: parentId || null,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  async list(
    userId: number,
    parentId?: number,
  ): Promise<ImgFolderResponseDto[]> {
    const whereFolder: any = { user: { id: userId } };

    if (parentId) {
      whereFolder.parent = { id: parentId };
    } else {
      whereFolder.parent = IsNull();
    }

    const folders = await this.folderRepository.find({
      where: whereFolder,
      relations: ['parent'],
    });

    return folders.map((folder) => this.toDto(folder));
  }

  async update(
    id: number,
    userId: number,
    name: string,
    parentId?: number,
  ): Promise<ImgFolderResponseDto> {
    const folder = await this.folderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['parent'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (name) {
      folder.name = name;
    }

    if (parentId !== undefined) {
      if (parentId === null) {
        folder.parent = null as any;
      } else {
        folder.parent = { id: parentId } as ImgFolder;
      }
    }

    const saved = await this.folderRepository.save(folder);
    return this.toDto(saved);
  }

  async delete(id: number, userId: number): Promise<void> {
    const folder = await this.folderRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    await this.folderRepository.remove(folder);
  }
}
