import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { UpdateDto, UpdateMailDto } from '../dto/auth.dto';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '../guard/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { isQQMail } from 'src/utils';
import { RedisService } from 'src/modules/redis/redis.service';

@ApiTags('UserInfo')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  @Post('update')
  async updateUser(
    @Body() body: UpdateDto,
    @Req() auth: ExpressRequest & { user: { userId: number } },
  ) {
    const { user } = auth;
    const userId = user.userId;
    const params = body;
    await this.userService.updateUser({ ...params, userId });
    return {
      code: 200,
      message: '更新成功',
    };
  }

  /**
   * 修改邮箱
   */
  @Post('update_mail')
  async updateMail(@Body() body: UpdateMailDto, @Req() auth) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    // const  = body;
    const { user } = auth;
    const userId = user.userId;
    return await this.userService.updateUserMail(body, userId);
  }
}
