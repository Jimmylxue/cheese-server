import { Injectable } from '@nestjs/common';
import { FanYiDto } from './dto/translate.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MD5 } from 'src/utils/md5';

@Injectable()
export class TranslateService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async translate({ from, to, q }: FanYiDto) {
    const appid = this.configService.get('BAIDU_APPID');
    const key = this.configService.get('BAIDU_KEY');
    const salt = new Date().getTime();
    const beforeSign = String(appid + q + salt + key).trim();
    const sign = MD5(beforeSign);
    const res = await this.httpService.axiosRef.get(
      `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURI(
        String(q),
      )}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
    );

    const { error_code, error_msg, trans_result } = res.data;

    if (error_code) {
      return {
        code: 500,
        message: error_msg,
      };
    }

    return {
      code: 200,
      result: {
        from,
        to,
        trans_result,
      },
    };
  }
}
