import { Body, Controller, Post } from '@nestjs/common';
import {
  LoginByMiniProgram,
  LoginByMiniProgramResponseDto,
} from '../dto/miniProgram.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MiniProgramService } from '../services/miniProgram.service';

@ApiTags('微信小程序登录')
@Controller('mini')
export class MiniProgramController {
  constructor(private miniProgramService: MiniProgramService) {}

  @ApiOperation({ summary: '微信小程序登录' })
  @ApiResponse({
    description: '微信小程序登录返回',
    type: LoginByMiniProgramResponseDto,
  })
  @Post('/login')
  async loginMiniProgram(@Body() body: LoginByMiniProgram) {
    return await this.miniProgramService.miniProgramLogin(body);
  }
}
