import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import { TCommitList } from 'src/modules/thirdPlatform/github/dto/gituhb.dto';

export class TaskBaseResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '列表集合',
    // 后期待补充
    example: [],
  })
  result: TCommitList[];
}
