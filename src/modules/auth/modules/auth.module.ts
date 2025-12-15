import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../services/constants';
import { UserModule } from './user.module';
import { ScanModule } from './scan.module';
import { MiniProgramModule } from './miniProgram.module';
import { MailAuthModule } from './mail.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
    UserModule,
    ScanModule,
    MiniProgramModule,
    MailAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
