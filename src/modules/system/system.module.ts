import { Module } from '@nestjs/common';
import { FileUploadModule } from './modules/fileUpload/fileUpload.module';
import { SiteLetterModule } from './modules/siteLetter/siteLetter.module';

@Module({
  imports: [FileUploadModule, SiteLetterModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class SystemModule {}
