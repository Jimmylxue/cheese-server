import { ApiProperty } from '@nestjs/swagger';

export class CheckinResponseDto {
  @ApiProperty({ description: '签到记录ID' })
  id: number;

  @ApiProperty({ description: '签到时间' })
  checkedAt: string;

  @ApiProperty({ description: '签到纬度', required: false })
  lat: number | null;

  @ApiProperty({ description: '签到经度', required: false })
  lng: number | null;
}
