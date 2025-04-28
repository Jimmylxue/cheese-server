import { Module } from '@nestjs/common';
import { WeChatPaymentController } from './controller/payment.controller';
import { WeChatPaymentService } from './services/payment.service';
@Module({
  imports: [],
  controllers: [WeChatPaymentController],
  providers: [WeChatPaymentService],
})
export class WeChatPaymentModule {}
