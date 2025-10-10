import { Module } from '@nestjs/common';
import { ScanAuthController } from '../controller/scan.controller';
import { ScanAuthService } from '../services/scan.service';
import { QrCodeService } from 'src/common/service/qrcode.service';
import { UserModule } from './user.module';
import { AuthService } from '../services/auth.service';
@Module({
  imports: [UserModule],
  providers: [ScanAuthService, QrCodeService, AuthService],
  controllers: [ScanAuthController],
  exports: [],
})
export class ScanModule {}
