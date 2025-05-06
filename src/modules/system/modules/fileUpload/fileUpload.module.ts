import { Module } from '@nestjs/common';
import { StaticModule } from './static/static.module';
import { UpyonModule } from './upyon/upyon.module';
import { CosModule } from './cos/cos.module';

@Module({
  imports: [StaticModule, UpyonModule, CosModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FileUploadModule {}
