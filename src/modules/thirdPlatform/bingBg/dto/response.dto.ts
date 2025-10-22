import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';

export class TBingImageItem {
  startdate: string;
  fullstartdate: string;
  enddate: string;
  url: string;
  urlbase: string;
  copyright: string;
  copyrightlink: string;
  title: string;
  quiz: string;
  wp: boolean;
  hsh: string;
  drk: number;
  top: number;
  bot: number;
}

export class BingBgResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '图片集合',
    example: 200,
  })
  result: {
    images: TBingImageItem[];
  };
}

export class BingBgTodayResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '图片集合',
    example:
      'https://cn.bing.com/th?id=OHR.ToucanForest_ZH-CN0072036253_UHD.jpg',
  })
  result: string;
}
