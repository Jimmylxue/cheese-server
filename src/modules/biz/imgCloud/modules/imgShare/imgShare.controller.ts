import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ApiCommonResponse } from 'src/common/decorators/api-response.decorator';
import { ImgShareService } from './imgShare.service';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareResponseDto } from './dto/share-response.dto';
import {
  ShareInfoResponseDto,
  ShareListResponseDto,
} from './dto/share-info-response.dto';
import { ListShareDto } from './dto/list-share.dto';
import { CancelShareDto } from './dto/cancel-share.dto';
import { ShareInfoDto } from './dto/share-info.dto';
import { AccessShareDto } from './dto/access-share.dto';
import { AdminUpdateShareDto } from './dto/admin-update-share.dto';

@ApiTags('Image Share')
@Controller('img-cloud/share')
@UseInterceptors(TransformInterceptor)
export class ImgShareController {
  constructor(private readonly imgShareService: ImgShareService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create Share Link' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ShareResponseDto)
  async create(@Body() dto: CreateShareDto, @Request() req) {
    return this.imgShareService.createShare(req.user.userId, dto);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel Share' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(Boolean)
  async cancel(@Body() dto: CancelShareDto, @Request() req) {
    return this.imgShareService.cancelShare(req.user.userId, dto);
  }

  @Post('list')
  @ApiOperation({ summary: 'List User Shares' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ShareListResponseDto)
  async list(@Body() dto: ListShareDto, @Request() req) {
    return this.imgShareService.listShares(req.user.userId, dto);
  }

  @Post('info')
  @ApiOperation({ summary: 'Get Share Info' })
  @ApiCommonResponse(ShareInfoResponseDto)
  async getInfo(@Body() dto: ShareInfoDto) {
    return this.imgShareService.getShareInfo(dto);
  }

  @Post('access')
  @ApiOperation({ summary: 'Access Share with Code' })
  @ApiCommonResponse(ShareInfoResponseDto)
  async access(@Body() dto: AccessShareDto) {
    return this.imgShareService.accessShare(dto);
  }

  @Post('admin/list')
  @ApiOperation({ summary: 'Admin List Shares' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ShareListResponseDto)
  async adminList(@Body() dto: ListShareDto) {
    return this.imgShareService.adminListShares(dto);
  }

  @Post('admin/update')
  @ApiOperation({ summary: 'Admin Update Share' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(Boolean)
  async adminUpdate(@Body() dto: AdminUpdateShareDto) {
    return this.imgShareService.adminUpdateShare(dto);
  }

  @Post('admin/delete')
  @ApiOperation({ summary: 'Admin Delete Share' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(Boolean)
  async adminDelete(@Body() dto: CancelShareDto) {
    return this.imgShareService.adminDeleteShare(dto);
  }
}
