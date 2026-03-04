import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckinResponseDto } from './dto/checkin-response.dto';
import { AuthGuard } from '../../../modules/auth/guard/auth.guard';
import { ApiCommonResponse } from '../../../common/decorators/api-response.decorator';
import { TransformInterceptor } from '../../../common/interceptors/transform.interceptor';

@ApiTags('checkin')
@Controller('checkin')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post('sign')
  @ApiOperation({ summary: '用户签到' })
  @UseInterceptors(TransformInterceptor)
  @ApiCommonResponse(CheckinResponseDto)
  async sign(
    @Body() createCheckinDto: CreateCheckinDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.checkinService.sign(req.user.userId, createCheckinDto);
  }
}
