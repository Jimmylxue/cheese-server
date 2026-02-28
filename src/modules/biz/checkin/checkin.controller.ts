import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckinResponseDto } from './dto/checkin-response.dto';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ApiCommonResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('checkin')
@Controller('checkin')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post('sign')
  @ApiOperation({ summary: '用户签到' })
  @ApiCommonResponse(CheckinResponseDto)
  async sign(@Body() createCheckinDto: CreateCheckinDto, @Req() req) {
    return this.checkinService.sign(req.user.userId, createCheckinDto);
  }
}
