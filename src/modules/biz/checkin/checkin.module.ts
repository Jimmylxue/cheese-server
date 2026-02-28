import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { CheckinRecord } from './entities/checkinRecord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckinRecord])],
  controllers: [CheckinController],
  providers: [CheckinService],
})
export class CheckinModule {}
