import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ImgShare } from '../../entities/imgShare.entity';
import { ImgResource } from '../../entities/imgResource.entity';
import { ImgFolder } from '../../entities/imgFolder.entity';
import { ImgShareService } from './imgShare.service';
import { ImgShareController } from './imgShare.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImgShare, ImgResource, ImgFolder]),
    ConfigModule,
  ],
  controllers: [ImgShareController],
  providers: [ImgShareService],
  exports: [ImgShareService],
})
export class ImgShareModule {}
