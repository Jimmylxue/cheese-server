import { ApiProperty } from '@nestjs/swagger';
import { ImgShare, ShareType } from '../../../entities/imgShare.entity';

export class ShareInfoResponseDto {
  @ApiProperty({ description: 'Is the share valid?' })
  isValid: boolean;

  @ApiProperty({ description: 'Is the share locked by access code?' })
  isLocked: boolean;

  @ApiProperty({ enum: ShareType, description: 'Share type' })
  type: ShareType;

  @ApiProperty({ description: 'Share creator ID' })
  creatorId: number;

  @ApiProperty({ description: 'Expiration date', nullable: true })
  expireAt: Date | null;

  @ApiProperty({ description: 'Shared content details', nullable: true })
  data: Record<string, unknown> | null;
}

export class ShareListResponseDto {
  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '分享列表', type: [ImgShare] })
  result: ImgShare[];

  @ApiProperty({ description: '总数' })
  total: number;
}
