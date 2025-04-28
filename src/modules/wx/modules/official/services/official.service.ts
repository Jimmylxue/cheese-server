import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeChatOfficialConfigParamsDto } from '../dto/wechatofficial.dto';
import { WeChatCommonService } from './common.service';
import sha1 from 'sha1';

type Sha1Function = (str: string) => string;

@Injectable()
export class WeChatOfficialService {
  constructor(
    private readonly configService: ConfigService,
    private readonly wechatCommonService: WeChatCommonService,
  ) {}

  async getJssdkConfig(body: WeChatOfficialConfigParamsDto) {
    const timestamp = this.wechatCommonService.generateTimestamp();
    const noncestr = this.wechatCommonService.generateNonceStr();
    const ticket = await this.wechatCommonService.getApkTicket();
    const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}+&url=${body.url}`;
    const signature = (sha1 as Sha1Function)(str);
    return {
      timestamp,
      noncestr,
      signature,
    };
  }
}
