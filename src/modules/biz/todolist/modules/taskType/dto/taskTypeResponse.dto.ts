import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import { TaskType } from '../../../entities/taskType.entity';

export class TaskTypeResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '列表集合',
    example: 200,
  })
  result: {
    page: number;
    total: number;
    result: TaskType[];
  };
}
