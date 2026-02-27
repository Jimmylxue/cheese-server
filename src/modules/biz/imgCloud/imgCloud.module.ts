import { Module } from '@nestjs/common';
import { ImgFolderModule } from './modules/imgFolder/imgFolder.module';
import { ImgResourceModule } from './modules/imgResource/imgResource.module';
import { ImgShareModule } from './modules/imgShare/imgShare.module';
import { ImgCloudController } from './imgCloud.controller';
import { ImgCloudService } from './imgCloud.service';

@Module({
  imports: [ImgFolderModule, ImgResourceModule, ImgShareModule],
  controllers: [ImgCloudController],
  providers: [ImgCloudService],
})
export class ImgCloudModule {}
