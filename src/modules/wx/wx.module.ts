import { Module } from '@nestjs/common';
import { WeChatPaymentModule } from './modules/payment/payment.module';
import { WeChatOfficialModule } from './modules/official/official.module';

@Module({
  imports: [WeChatOfficialModule, WeChatPaymentModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class WxModule {}
