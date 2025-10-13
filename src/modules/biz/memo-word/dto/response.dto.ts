import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import { UserWord } from '../entities/userWord.entity';

export class WordsListResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '列表集合',
    example: 200,
  })
  result: {
    page: number;
    total: number;
    result: UserWord[];
  };
}
