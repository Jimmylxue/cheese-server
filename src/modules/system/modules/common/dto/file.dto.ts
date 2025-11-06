import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseResponseDto } from 'src/common/dto/response.dto';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '要上传的文件',
  })
  @IsNotEmpty()
  file: any;
}

export class UploadSuccessResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '图片集合',
    example:
      'https://api.jimmyxuexue.top/storage/1762399304723WechatIMG48947.jpg',
  })
  result: string;
}
