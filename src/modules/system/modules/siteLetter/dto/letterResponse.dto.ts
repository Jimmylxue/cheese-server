import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import { Letter } from '../entities/letter.entity';

class LetterItem extends Letter {
  @ApiProperty({
    description: '已读数量',
    example: 10,
  })
  hasReadCount: number;

  @ApiProperty({
    description: '未读数量',
    example: 5,
  })
  notReadCount: number;
}

export class LetterListResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '列表集合',
    example: 200,
  })
  result: {
    page: number;
    total: number;
    result: LetterItem[];
  };
}
