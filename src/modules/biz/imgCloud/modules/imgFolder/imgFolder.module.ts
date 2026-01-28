import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImgFolder } from '../../entities/imgFolder.entity';
import { ImgFolderController } from './imgFolder.controller';
import { ImgFolderService } from './imgFolder.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImgFolder])],
  controllers: [ImgFolderController],
  providers: [ImgFolderService],
  exports: [ImgFolderService],
})
export class ImgFolderModule {}
