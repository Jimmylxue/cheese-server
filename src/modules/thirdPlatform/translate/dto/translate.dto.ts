import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseResponseDto } from 'src/common/dto/response.dto';

export class FanYiDto {
  @ApiProperty({ description: '需翻译文本', example: '苹果' })
  @IsNotEmpty({ message: '翻译文本不能为空' })
  q: string;

  @ApiProperty({ description: '原语种', example: 'zh' })
  @IsString({ message: '被翻译的语种必须是字符类型' })
  from: string;

  @ApiProperty({ description: '翻译语种', example: 'en' })
  @IsString({ message: '要翻译的语种必须是字符类' })
  to: string;
}

export class TranslateResponseDto extends BaseResponseDto {
  result: FanYiDto;
}

export class CheckLanguageDto {
  @IsNotEmpty({ message: '检查语种-不能为空' })
  @IsString({ message: '检查语种-必须是字符类' })
  q: string;
}

export class PictureTranslateDto {
  @IsString({ message: '被翻译的语种必须是字符类型' })
  from: string;

  @IsString({ message: '要翻译的语种必须是字符类' })
  to: string;
}
