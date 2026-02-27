import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { ApiCommonResponse } from 'src/common/decorators/api-response.decorator';
import { ImgShareService } from './imgShare.service';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareResponseDto } from './dto/share-response.dto';
import { ShareInfoResponseDto } from './dto/share-info-response.dto';

@ApiTags('Image Share')
@Controller('img-cloud/share')
export class ImgShareController {
  constructor(private readonly imgShareService: ImgShareService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create Share Link' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ShareResponseDto)
  async create(@Body() dto: CreateShareDto, @Request() req) {
    return this.imgShareService.createShare(req.user.userId, dto);
  }

  @Get(':token')
  @ApiOperation({ summary: 'Get Share Info' })
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(ShareInfoResponseDto)
  async getShareInfo(@Param('token') token: string) {
    return this.imgShareService.getShareInfo(token);
  }
}
