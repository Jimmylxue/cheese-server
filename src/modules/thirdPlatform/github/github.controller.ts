import { Body, Controller, Get } from '@nestjs/common';
import { GithubService } from './github.service';
import { GetCommitDto } from './dto/gituhb.dto';
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/commit')
  async getCommitInfo(@Body() req: GetCommitDto) {
    const data = await this.githubService.getCommit(req);
    if (data.code === 200) {
      return {
        code: 200,
        result: data.commitList,
      };
    }
    return {
      code: 500,
      message: '获取提交记录失败',
    };
  }
}
