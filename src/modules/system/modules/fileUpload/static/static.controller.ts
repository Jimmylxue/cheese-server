import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { hasDir, mkADir, writeAFile } from 'src/utils/file';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileUploadDto,
  UploadSuccessResponseDto,
} from '../../common/dto/file.dto';

@ApiTags('Static 本地图片上传')
@Controller('static')
export class StaticController {
  constructor(private readonly configService: ConfigService) {}

  @ApiOperation({ summary: '上传图片' })
  @ApiResponse({
    description: '上传返回内容',
    type: UploadSuccessResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '选择要上传的文件',
    type: FileUploadDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/uploadfile')
  @UseInterceptors(FileInterceptor('file'))
  async getBaseInfos(@UploadedFile() file) {
    const originPath = resolve(process.cwd(), 'public/storage');
    const baseUrl =
      this.configService.get<string>('STATIC_BASE_URL') + '/storage';

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
