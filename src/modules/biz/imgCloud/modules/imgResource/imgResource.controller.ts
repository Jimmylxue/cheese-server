import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ImgResourceService } from './imgResource.service';
import { ListDto } from '../../dto/list.dto';
import { UploadImageDto } from '../../dto/upload-image.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ApiCommonResponse } from 'src/common/decorators/api-response.decorator';
import { ImgResourceResponseDto } from '../../dto/resource-response.dto';
import { UpdateResourceDto } from '../../dto/update-resource.dto';
import { DeleteResourceDto } from '../../dto/delete-resource.dto';

@ApiTags('Image Resource')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('img-cloud/resource')
export class ImgResourceController {
  constructor(
    private readonly imgResourceService: ImgResourceService,
    private readonly httpService: HttpService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'List Images' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ImgResourceResponseDto, true)
  async list(@Query() dto: ListDto, @Request() req) {
    const folderId = dto.folderId ? Number(dto.folderId) : undefined;
    return this.imgResourceService.list(req.user.sub, folderId);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload Image' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folderId: {
          type: 'integer',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiCommonResponse(ImgResourceResponseDto)
  async upload(
    @UploadedFile() file,
    @Body() dto: UploadImageDto,
    @Request() req,
  ) {
    const folderId = dto.folderId ? Number(dto.folderId) : undefined;
    return this.imgResourceService.upload(file, req.user.sub, folderId);
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download Image' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Image file stream' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async download(@Param('id') id: number, @Res() res: Response) {
    const img = await this.imgResourceService.getOne(id);
    if (!img) {
      throw new NotFoundException('Image not found');
    }

    try {
      const response = await this.httpService.axiosRef({
        url: img.url,
        method: 'GET',
        responseType: 'stream',
      });

      res.set({
        'Content-Type': img.mimetype || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(img.filename)}"`,
      });

      response.data.pipe(res);
    } catch (error) {
      throw new NotFoundException('File not found on remote server');
    }
  }

  @Post('update')
  @ApiOperation({ summary: 'Update Image Info' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ImgResourceResponseDto)
  async update(@Body() dto: UpdateResourceDto, @Request() req) {
    return this.imgResourceService.update(
      dto.id,
      req.user.sub,
      dto.filename,
      dto.folderId,
    );
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete Image' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse()
  async delete(@Body() dto: DeleteResourceDto, @Request() req) {
    return this.imgResourceService.delete(dto.id, req.user.sub);
  }
}
