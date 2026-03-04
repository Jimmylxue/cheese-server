import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CheckinRecord } from './entities/checkinRecord.entity';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckinResponseDto } from './dto/checkin-response.dto';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(CheckinRecord)
    private checkinRepository: Repository<CheckinRecord>,
  ) {}

  async sign(
    userId: number,
    createCheckinDto: CreateCheckinDto,
  ): Promise<CheckinResponseDto> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    // Check if already checked in today
    const existing = await this.checkinRepository.findOne({
      where: {
        userId,
        checkedAt: Between(startOfDay, endOfDay),
      },
    });

    if (existing) {
      throw new BadRequestException('当日已签到');
    }

    const record = this.checkinRepository.create({
      userId,
      checkedAt: now,
      lat: createCheckinDto.lat,
      lng: createCheckinDto.lng,
    });

    const saved = await this.checkinRepository.save(record);

    return {
      id: saved.id,
      checkedAt: saved.checkedAt.toISOString(),
      lat: saved.lat !== null ? Number(saved.lat) : null,
      lng: saved.lng !== null ? Number(saved.lng) : null,
    };
  }
}
