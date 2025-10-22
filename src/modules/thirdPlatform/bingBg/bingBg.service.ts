import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TBingImageItem } from './dto/response.dto';
import { BingBgDto } from './dto/bingBg.dto';

@Injectable()
export class BingBgService {
  constructor(private httpService: HttpService) {}
  async getBackground(n: number) {
    // 近7日的bing美图 n => 数量 最多为7
    const { data: imgList } = await this.httpService.axiosRef.get(
      `https://cn.bing.com/HPImageArchive.aspx?format=js&n=${n}&uhd=1`,
    );
    return {
      images: (Array.isArray(imgList?.images)
        ? imgList.images
        : []) as TBingImageItem[],
    };
  }

  async getWeekBackgroundList() {
    const imgs = await this.getBackground(7);
    if (imgs.images?.length) {
      return {
        code: 200,
        result: imgs,
        message: '请求成功',
      };
    }
    return {
      code: 500,
      result: [],
      message: 'THIRD_PART_SERVICE_ERROR_CODE',
    };
  }

  async getTodayBg(params: BingBgDto) {
    const imgs = await this.getBackground(1);
    const urlBase = imgs?.images?.[0]?.urlbase;
    if (urlBase) {
      return {
        code: 200,
        result: `https://cn.bing.com/${urlBase}_${
          !JSON.parse(params.UHD) ? '1920x1080' : 'UHD'
        }.jpg`,
      };
    }
    return {
      code: 500,
      result: [],
      message: 'THIRD_PART_SERVICE_ERROR_CODE',
    };
  }
}
