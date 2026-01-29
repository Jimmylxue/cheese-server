import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as upyun from 'upyun';
@Injectable()
export class UpyonService {
  constructor(private readonly configService: ConfigService) {}

  async upload(
    file: any,
  ): Promise<{ success: boolean; url?: string; message?: string }> {
    const service = new upyun.Service(
      this.configService.get('UP_SERVICE_NAME'),
      this.configService.get('UP_OPERATOR_NAME'),
      this.configService.get('UP_PASSWORD'),
    );
    const client = new upyun.Client(service);
    const fileName = Date.now() + file.originalname;
    const res = await client.putFile('upload/' + fileName, file.buffer);
    console.log('res', res);
    if (res) {
      return {
        success: true,
        url: `https://image.jimmyxuexue.top/upload/${fileName}`,
      };
    }

    return {
      success: false,
      message: 'Upload failed',
    };
  }
}
