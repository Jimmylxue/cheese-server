import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ImgResource } from '../../entities/imgResource.entity';
import { ImgResourceController } from './imgResource.controller';
import { ImgResourceService } from './imgResource.service';
import { UpyonModule } from 'src/modules/system/modules/fileUpload/upyon/upyon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImgResource]),
    ConfigModule,
    UpyonModule,
    HttpModule,
  ],
  controllers: [ImgResourceController],
  providers: [ImgResourceService],
  exports: [ImgResourceService],
})
export class ImgResourceModule {}
