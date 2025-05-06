import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { hasDir, mkADir, writeAFile } from 'src/utils/file';

@Controller('static')
export class StaticController {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 上传是上传到 dist 下的文件夹
   */
  @Post('/uploadfile')
  @UseInterceptors(FileInterceptor('file'))
  async getBaseInfos(@UploadedFile() file) {
    const originPath = resolve(process.cwd(), 'public');
    const baseUrl = this.configService.get<string>('STATIC_BASE_URL');

    const hasOriginDir = await hasDir(originPath);
    if (!hasOriginDir) {
      console.log('目录不存在，手动创建目录');
      await mkADir(originPath);
    }

    const fileName = Date.now() + file.originalname;

    const writeRes = await writeAFile(file, `${originPath}/${fileName}`);
    if (writeRes) {
      return {
        code: 200,
        message: '文件写入成功',
        result: `${baseUrl}/${fileName}`,
      };
    }
    return { code: 500, message: '文件写入失败' };
  }
}
