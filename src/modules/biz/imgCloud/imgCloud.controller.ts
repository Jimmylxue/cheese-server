import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ImgCloudListResponseDto } from './dto/cloud-list-response.dto';
import { ListDto } from './dto/list.dto';
import { ApiCommonResponse } from 'src/common/decorators/api-response.decorator';
import { ImgCloudService } from './imgCloud.service';

@ApiTags('Image Cloud (Aggregate)')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('img-cloud')
export class ImgCloudController {
  constructor(private readonly imgCloudService: ImgCloudService) {}

  @Get('list-all')
  @ApiOperation({ summary: 'List Folders and Images' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ImgCloudListResponseDto)
  async listAll(@Query() dto: ListDto, @Request() req) {
    const folderId = dto.folderId ? Number(dto.folderId) : undefined;
    return this.imgCloudService.list(req.user.userId, folderId);
  }
}
