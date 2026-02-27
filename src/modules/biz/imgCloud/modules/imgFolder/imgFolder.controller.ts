import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ImgFolderService } from './imgFolder.service';
import { CreateFolderDto } from '../../dto/create-folder.dto';
import { ListDto } from '../../dto/list.dto';
import { ImgFolderResponseDto } from '../../dto/folder-response.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ApiCommonResponse } from 'src/common/decorators/api-response.decorator';
import { UpdateFolderDto } from '../../dto/update-folder.dto';
import { DeleteFolderDto } from '../../dto/delete-folder.dto';
import { FolderTreeResponseDto } from '../../dto/folder-tree-response.dto';

@ApiTags('Image Folder')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('img-cloud/folder')
export class ImgFolderController {
  constructor(private readonly imgFolderService: ImgFolderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create Folder' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ImgFolderResponseDto)
  async create(@Body() dto: CreateFolderDto, @Request() req) {
    return this.imgFolderService.create(dto.name, req.user.sub, dto.parentId);
  }

  @Get('list')
  @ApiOperation({ summary: 'List Folders' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ImgFolderResponseDto, true)
  async list(@Query() dto: ListDto, @Request() req) {
    // 增加日志以调试参数传递
    console.log('ImgFolderController.list raw query:', dto);
    // 处理可能得空字符串或 'null' 字符串
    let folderId: number | undefined;
    if (dto.folderId !== undefined && dto.folderId !== null) {
      const num = Number(dto.folderId);
      if (!isNaN(num)) {
        folderId = num;
      }
    }

    return this.imgFolderService.list(req.user.sub, folderId);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get Folder Tree Structure' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(FolderTreeResponseDto, true)
  async getTree(@Request() req) {
    return this.imgFolderService.getTree(req.user.sub);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update Folder' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ImgFolderResponseDto)
  async update(@Body() dto: UpdateFolderDto, @Request() req) {
    return this.imgFolderService.update(
      dto.id,
      req.user.userId,
      dto.name,
      dto.parentId,
    );
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete Folder' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse()
  async delete(@Body() dto: DeleteFolderDto, @Request() req) {
    return this.imgFolderService.delete(dto.id, req.user.userId);
  }
}
