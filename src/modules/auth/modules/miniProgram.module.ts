import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MiniProgramController } from '../controller/miniProgram.controller';
import { MiniProgramService } from '../services/miniProgram.service';
import { AuthService } from '../services/auth.service';
import { UserModule } from './user.module';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [MiniProgramController],
  providers: [MiniProgramService, AuthService],
})
export class MiniProgramModule {}
