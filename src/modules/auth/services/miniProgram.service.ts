import { Injectable } from '@nestjs/common';
import { UsersService } from './user.service';
import { LoginByMiniProgram } from '../dto/miniProgram.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';

@Injectable()
export class MiniProgramService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async miniProgramLogin(body: LoginByMiniProgram) {
    const appID = this.configService.get('WX_MINI_PROGRAM_APPID');
    const AppSecret = this.configService.get('WX_MINI_PROGRAM_APPSECRET');
    const { code, ...userInfo } = body;
    const res = await this.httpService.axiosRef.get<{
      openid: string;
      session_key: string;
      errmsg: string;
    }>(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`,
    );
    if (res.status === 200 && res.data.openid) {
      /**
       * 判断是否是系统内用户
       *  如果是 -> 返回用户信息
       *  如果不是 -> 根据openid 注册一个
       */
      const checkUser = await this.usersService.getUserByOpenId(
        res.data.openid,
      );
      if (checkUser?.id) {
        const access_token = await this.authService.createToken(checkUser);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...args } = checkUser;
        return {
          code: 200,
          result: {
            token: access_token,
            user: args,
          },
        };
      } else {
        await this.usersService.createUserByMiniProgram({
          ...userInfo,
          openid: res.data.openid,
        });
        const user = await this.usersService.getUserByOpenId(res.data.openid);
        const access_token = await this.authService.createToken(user);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...args } = user!;
        return {
          code: 200,
          result: {
            token: access_token,
            user: args,
          },
        };
      }
    } else {
      return {
        code: 500,
        message: res.data.errmsg,
      };
    }
  }
}
