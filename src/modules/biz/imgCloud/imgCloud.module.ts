import { Module } from '@nestjs/common';
import { ImgFolderModule } from './modules/imgFolder/imgFolder.module';
import { ImgResourceModule } from './modules/imgResource/imgResource.module';
import { ImgCloudController } from './imgCloud.controller';
import { ImgCloudService } from './imgCloud.service';

@Module({
  imports: [ImgFolderModule, ImgResourceModule],
  controllers: [ImgCloudController],
  providers: [ImgCloudService],
})
export class ImgCloudModule {}
