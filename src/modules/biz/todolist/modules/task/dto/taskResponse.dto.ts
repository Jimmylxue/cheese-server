import { BaseResponseDto } from 'src/common/dto/response.dto';
import { Task } from '../../../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '列表集合',
    example: 200,
  })
  result: {
    page: number;
    total: number;
    result: Task[];
  };
}

export class TaskDetailResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '任务详情',
    type: Task,
  })
  result: Task;
}

export class TaskSearchResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '列表集合',
    example: '操作成功',
  })
  result: {
    total: number;
    result: Task[];
  };
}
