import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { GetCommitDto } from 'src/modules/thirdPlatform/github/dto/gituhb.dto';
import { GithubService } from 'src/modules/thirdPlatform/github/github.service';
import { TaskBaseResponseDto } from './dto/baseResponse.dto';

@ApiTags('待办事项-基础')
@Controller('base')
export class BaseController {
  constructor(private readonly githubService: GithubService) {}

  @ApiOperation({ summary: '查看更新记录' })
  @ApiResponse({
    description: '更新记录返回',
    type: TaskBaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/UpdateRecord')
  async getTodoListUpdateRecord(@Body() req: GetCommitDto) {
    const data = await this.githubService.getCommit(req);
    if (data.code === 200) {
      return {
        code: 200,
        result: data.commitList,
      };
    }
    return {
      code: 500,
      message: '获取更新记录失败',
    };
  }
}
