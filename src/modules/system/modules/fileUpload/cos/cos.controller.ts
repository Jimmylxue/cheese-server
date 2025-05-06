import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as COS from 'cos-nodejs-sdk-v5';

// @UseGuards(AuthGuard('jwt'))
@Controller('cos')
export class CosController {
  private cosClient: COS;

  constructor(private readonly configService: ConfigService) {
    // 初始化 COS 实例
    this.cosClient = new COS({
      SecretId: this.configService.get('TENCENT_SECRET_ID'),
      SecretKey: this.configService.get('TENCENT_SECRET_KEY'),
    });
  }

  @Post('/cos')
  @UseInterceptors(FileInterceptor('file'))
  async uploadToCos(@UploadedFile() file) {
    console.log('fff', file);
    const fileName = Date.now() + file.originalname;
    const bucket = this.configService.get<string>('COS_BUCKET') || '';
    const region = this.configService.get<string>('COS_REGION') || '';

    if (!bucket || !region) {
      throw new Error('Missing COS configuration');
    }

    try {
      await new Promise((resolve, reject) => {
        this.cosClient.putObject(
          {
            Bucket: bucket,
            Region: region,
            Key: 'upload/' + fileName,
            Body: file.buffer,
          },
          (err, data) => {
            if (err) {
              reject(new Error(err.message));
              return;
            }
            resolve(data);
          },
        );
      }).catch((error) => {
        throw new Error(error.message);
      });

      return {
        code: 200,
        message: '上传成功',
        result: `https://${bucket}.cos.${region}.myqcloud.com/upload/${fileName}`,
      };
    } catch (error: any) {
      return {
        code: 500,
        message: '上传失败',
        error: error.message,
      };
    }
  }
}
