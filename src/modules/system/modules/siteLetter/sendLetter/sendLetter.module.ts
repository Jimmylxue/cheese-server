import { Module } from '@nestjs/common';
import { SendLetterService } from './sendLetter.service';
import { SendLetterController } from './sendLetter.controller';
import { LetterService } from '../letter/letter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendRecord } from '../entities/sendRecord.entity';
import { Letter } from '../entities/letter.entity';
import { UserModule } from 'src/modules/auth/modules/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([SendRecord, Letter])],
  providers: [LetterService, SendLetterService],
  controllers: [SendLetterController],
})
export class SendLetterModule {}
