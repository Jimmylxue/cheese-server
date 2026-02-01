import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ImgFolder } from '../../entities/imgFolder.entity';
import { ImgResource } from '../../entities/imgResource.entity';
import { ImgFolderResponseDto } from '../../dto/folder-response.dto';
import { FolderTreeResponseDto } from '../../dto/folder-tree-response.dto';

@Injectable()
export class ImgFolderService {
  constructor(
    @InjectRepository(ImgFolder)
    private folderRepository: Repository<ImgFolder>,
    @InjectRepository(ImgResource)
    private resourceRepository: Repository<ImgResource>,
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

  private toTreeDto(entity: ImgFolder): FolderTreeResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      parentId: entity.parent ? entity.parent.id : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      children: [],
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
    const whereFolder: any = {
      user: { id: userId },
    };

    if (parentId) {
      whereFolder.parent = { id: parentId };
    } else {
      whereFolder.parent = IsNull();
    }

    console.log('ImgFolderService.list query params:', { userId, parentId });
    console.log(
      'ImgFolderService.list where conditions:',
      JSON.stringify(whereFolder),
    );

    const folders = await this.folderRepository.find({
      where: whereFolder,
      relations: ['parent'],
    });

    console.log(`ImgFolderService.list found ${folders.length} folders`);

    return folders.map((folder) => this.toDto(folder));
  }

  async getTree(userId: number): Promise<FolderTreeResponseDto[]> {
    // 1. Fetch all folders for the user
    const folders = await this.folderRepository.find({
      where: { user: { id: userId } },
      relations: ['parent'],
      order: { createdAt: 'ASC' },
    });

    // 2. Build map for O(1) access
    const folderMap = new Map<number, FolderTreeResponseDto>();
    folders.forEach((folder) => {
      folderMap.set(folder.id, this.toTreeDto(folder));
    });

    // 3. Build tree
    const rootFolders: FolderTreeResponseDto[] = [];
    folders.forEach((folder) => {
      const folderDto = folderMap.get(folder.id);
      if (!folderDto) return; // Should not happen

      if (folder.parent) {
        const parentDto = folderMap.get(folder.parent.id);
        if (parentDto) {
          parentDto.children.push(folderDto);
        } else {
          // Parent might be missing or belongs to another user (should not happen in strict mode),
          // or deleted. If strict integrity, this case is impossible.
          // Fallback: treat as root or ignore. Treating as root for safety.
          rootFolders.push(folderDto);
        }
      } else {
        rootFolders.push(folderDto);
      }
    });

    return rootFolders;
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

    await this.deleteRecursive(folder);
  }

  private async deleteRecursive(folder: ImgFolder) {
    // 1. Find all children
    const children = await this.folderRepository.find({
      where: { parent: { id: folder.id } },
    });

    // 2. Recursively delete children
    for (const child of children) {
      await this.deleteRecursive(child);
    }

    // 3. Soft delete all images in this folder before deleting the folder
    const images = await this.resourceRepository.find({
      where: { folder: { id: folder.id }, isDelete: false },
    });

    for (const image of images) {
      image.isDelete = true;
      image.deletedAt = new Date();
      // Keep folder reference if you want to know where it came from,
      // but if folder is hard deleted, DB might set it to NULL.
      // If we want to keep it in "Trash" effectively, we rely on isDelete=true on the image.
      // Since folder is being hard deleted, we accept folder_id will become NULL.
      await this.resourceRepository.save(image);
    }

    // 4. Hard delete the folder
    await this.folderRepository.remove(folder);
  }
}
