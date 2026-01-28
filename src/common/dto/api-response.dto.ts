import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '消息', example: 'success' })
  message: string;

  @ApiHideProperty()
  result: T;
}
