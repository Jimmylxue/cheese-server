import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeChatPaymentService } from '../services/payment.service';
import { PayNotifyDto, PayParamsDto } from '../dto/payment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';

@ApiTags('微信支付')
@Controller('wechatpay')
export class WeChatPaymentController {
  constructor(
    private readonly configService: ConfigService,
    private readonly wechatPaymentService: WeChatPaymentService,
  ) {}

  @Get('pay')
  @ApiOperation({ summary: '测试支付的内容' })
  @ApiResponse({ status: 200, description: '成功返回猫咪列表' })
  prePayment(@Query() query: PayParamsDto) {
    return query;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Post('notify')
  @ApiOperation({ summary: '测试支付的内容' })
  @ApiBody({ type: PayNotifyDto })
  @ApiResponse({ status: 200, description: '成功返回猫咪列表' })
  notify(@Query() query: PayNotifyDto) {
    return query;
  }
}
