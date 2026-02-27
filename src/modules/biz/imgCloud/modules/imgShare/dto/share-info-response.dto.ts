import { ApiProperty } from '@nestjs/swagger';
import { ShareType } from '../../../entities/imgShare.entity';

export class ShareInfoResponseDto {
  @ApiProperty({ description: 'Is the share valid?' })
  isValid: boolean;

  @ApiProperty({ enum: ShareType, description: 'Share type' })
  type: ShareType;

  @ApiProperty({ description: 'Share creator ID' })
  creatorId: number;

  @ApiProperty({ description: 'Expiration date', nullable: true })
  expireAt: Date | null;
  
  @ApiProperty({ description: 'Shared content details' })
  data: any; 
}
