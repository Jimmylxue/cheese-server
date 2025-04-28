import { Module } from '@nestjs/common';
import { WeChatPaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [WeChatPaymentModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class WxModule {}
