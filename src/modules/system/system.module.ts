import { Module } from '@nestjs/common';
import { FileUploadModule } from './modules/fileUpload/fileUpload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class SystemModule {}
