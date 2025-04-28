import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/modules/redis/redis.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WeChatCommonService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 生成16位随机字符串
   * @returns string
   */
  generateNonceStr() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonceStr = '';
    for (let i = 0; i < 16; i++) {
      nonceStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonceStr;
  }

  /**
   * 生成时间戳
   * @returns number
   */
  generateTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * 获取微信 jssdk 的 access_token
   * @returns {Promise<string>}
   */
  async getWxToken(): Promise<string> {
    const appID = this.configService.get<string>('WX_OFFICIAL_APPID');
    const appSecret = this.configService.get<string>('WX_OFFICIAL_APPSECRET');
    const wxAccessToken = await this.redisService.get<{
      access_token: string;
      deadline: number;
    }>(`snow-server-wx-accessToken`);
    if (
      !wxAccessToken ||
      (wxAccessToken && wxAccessToken.deadline - 10000 < new Date().getTime())
    ) {
      console.log('重新获取access_token');
      // 过期或首次获取 => 直接取新的access_token
      const res = await this.httpService.axiosRef.get<{
        access_token: string;
        expires_in: number;
      }>(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`,
      );
      if (res.data && res.data.access_token) {
        await this.redisService.set(
          'snow-server-wx-accessToken',
          JSON.stringify({
            ...res.data,
            deadline: new Date().getTime() + res.data.expires_in * 1000,
          }),
        );
        console.log(
          'redisSaveData',
          JSON.stringify({
            ...res.data,
            deadline: new Date().getTime() + res.data.expires_in * 1000,
          }),
        );
        return res.data.access_token;
      } else {
        return '';
      }
    } else {
      console.log('token 来自redis');
      return wxAccessToken.access_token;
    }
  }

  /**
   * 获取微信 jssdk 的 jsapi_ticket
   * @returns {Promise<string>}
   */
  async getApkTicket(): Promise<string> {
    const assessToken = await this.getWxToken();
    const wxJsApiTicket = await this.redisService.get<{
      ticket: string;
      deadline: number;
    }>(`snow-server-wx-jsapi_ticket`);
    if (
      !wxJsApiTicket ||
      (wxJsApiTicket && wxJsApiTicket.deadline - 10000 < new Date().getTime())
    ) {
      console.log('重新获取 jsapi_ticket');
      // 过期或首次获取 => 直接取新的access_token
      const res = await this.httpService.axiosRef.get<{
        ticket: string;
        expires_in: number;
      }>(
        `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${assessToken}&type=jsapi`,
      );
      if (res.data && res.data.ticket) {
        await this.redisService.set(
          'snow-server-wx-jsapi_ticket',
          JSON.stringify({
            ...res.data,
            deadline: new Date().getTime() + res.data.expires_in * 1000,
          }),
        );
        console.log(
          'redisSaveData',
          JSON.stringify({
            ...res.data,
            deadline: new Date().getTime() + res.data.expires_in * 1000,
          }),
        );
        return res.data.ticket;
      } else {
        return '';
      }
    } else {
      console.log('apitick 来自redis');
      // 未过期 - 从redis中取出 access_token
      return wxJsApiTicket.ticket;
    }
  }
}
