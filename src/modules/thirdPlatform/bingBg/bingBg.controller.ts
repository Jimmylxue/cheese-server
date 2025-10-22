import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BingBgService } from './bingBg.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BingBgResponseDto, BingBgTodayResponseDto } from './dto/response.dto';
import { BingBgDto } from './dto/bingBg.dto';

@ApiTags('必应壁纸')
@Controller('bingBg')
export class BingBgController {
  constructor(private readonly bingBgService: BingBgService) {}

  @ApiOperation({ summary: '查询近七天壁纸' })
  @ApiResponse({
    description: '壁纸返回',
    type: BingBgResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/weekList')
  async getWeekBackgroundList() {
    return await this.bingBgService.getWeekBackgroundList();
  }

  @ApiOperation({ summary: '查询今日壁纸' })
  @ApiResponse({
    description: '壁纸返回',
    type: BingBgTodayResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/today')
  async getTodayBg(@Query() req: BingBgDto) {
    return await this.bingBgService.getTodayBg(req);
  }

  // @Post('/love')
  // async loveImage(@Body() body: loveStatus) {
  //   const res = await this.bingBgService.addImage(body);
  //   if (res.status === 0) {
  //     return { code: 500, message: res.message };
  //   }
  //   return {
  //     code: 200,
  //     message: res.message,
  //   };
  // }

  // // 将每日图片保存一份至数据库
  // @Get('/store')
  // async storeTodayBg() {
  //   const data = await this.bingBgService.storeTodayBg();
  //   if (data.code !== 200) {
  //     // 日志上报
  //     this.logger.log(JSON.stringify({ ...data, path: '/bingBg/store' }));
  //   }
  //   return data;
  // }
}
