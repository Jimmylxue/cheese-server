import { ApiProperty } from '@nestjs/swagger';
import { SendRecord } from '../entities/sendRecord.entity';
import { BaseResponseDto } from 'src/common/dto/response.dto';

export class LetterRecordResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '列表集合',
    example: 200,
  })
  result: SendRecord[];
}
