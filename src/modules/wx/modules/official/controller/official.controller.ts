import { Body, Controller, Post } from '@nestjs/common';
import { WeChatOfficialService } from '../services/official.service';
import { WeChatOfficialConfigParamsDto } from '../dto/wechatofficial.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('微信公众平台')
@Controller('wechatofficial')
export class WeChatOfficialController {
  constructor(private readonly wechatOfficialService: WeChatOfficialService) {}

  @Post('/config/jssdk')
  @ApiOperation({ summary: '获取微信JS-SDK配置' })
  async getJssdkConfig(@Body() body: WeChatOfficialConfigParamsDto) {
    const res = await this.wechatOfficialService.getJssdkConfig(body);
    return {
      code: 200,
      result: res,
    };
  }
}
