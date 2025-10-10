// src/qr/qr.service.ts
import { Injectable } from '@nestjs/common';
import { toBuffer, toDataURL, toString } from 'qrcode';

@Injectable()
export class QrCodeService {
  // 生成二维码数据URL
  async generateQRCodeDataURL(text: string): Promise<string> {
    try {
      return await toDataURL(text);
    } catch (err) {
      throw new Error(`生成二维码失败: ${err.message}`);
    }
  }

  // 生成二维码Buffer
  async generateQRCodeBuffer(text: string): Promise<Buffer> {
    try {
      return await toBuffer(text);
    } catch (err) {
      throw new Error(`生成二维码失败: ${err.message}`);
    }
  }

  // 生成二维码SVG
  async generateQRCodeSVG(text: string): Promise<string> {
    try {
      return await toString(text, { type: 'svg' });
    } catch (err) {
      throw new Error(`生成二维码失败: ${err.message}`);
    }
  }
}
