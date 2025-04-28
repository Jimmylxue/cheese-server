import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class WeChatPaymentService {
  constructor(private readonly configService: ConfigService) {}
}
