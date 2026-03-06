import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { NoticeService } from './notice.service';
import {
  AdminTriggerDto,
  AdminTriggerResponseDto,
  RecordsListDto,
  RecordsListResponseDto,
  RunsListDto,
  RunsListResponseDto,
} from './dto/admin.dto';
import {
  SettingResponseDto,
  UpdateSettingDto,
  UpdateSettingResponseDto,
} from './dto/setting.dto';

@ApiTags('待办通知')
@Controller('todo-notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({ summary: '获取用户通知设置' })
  @ApiResponse({ description: '通知设置返回', type: SettingResponseDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/setting/get')
  async getSetting(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const result = await this.noticeService.getSetting(userId);
    return {
      code: 200,
      result,
    };
  }

  @ApiOperation({ summary: '更新用户通知设置' })
  @ApiResponse({ description: '是否成功', type: UpdateSettingResponseDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/setting/update')
  async updateSetting(@Body() req: UpdateSettingDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const ok = await this.noticeService.updateSetting(userId, req);
    return {
      code: ok ? 200 : 500,
      result: ok,
    };
  }

  @ApiOperation({ summary: '管理员手动触发今日通知' })
  @ApiResponse({ description: '触发结果', type: AdminTriggerResponseDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/admin/trigger')
  async trigger(@Body() req: AdminTriggerDto, @Req() auth) {
    const { user } = auth;
    const adminId = user.userId;
    const result = await this.noticeService.adminTrigger(adminId, req);
    return {
      code: 200,
      result,
    };
  }

  @ApiOperation({ summary: '管理员查询通知记录' })
  @ApiResponse({ description: '记录列表', type: RecordsListResponseDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/admin/records')
  async records(@Body() req: RecordsListDto) {
    const { page, result, total } = await this.noticeService.listRecords(req);
    return {
      code: 200,
      result: {
        page,
        result,
        total,
      },
    };
  }

  @ApiOperation({ summary: '管理员查询通知运行记录' })
  @ApiResponse({ description: '运行记录', type: RunsListResponseDto })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/admin/runs')
  async runs(@Body() req: RunsListDto) {
    const { page, result, total } = await this.noticeService.listRuns(req);
    return {
      code: 200,
      result: {
        page,
        result,
        total,
      },
    };
  }
}
