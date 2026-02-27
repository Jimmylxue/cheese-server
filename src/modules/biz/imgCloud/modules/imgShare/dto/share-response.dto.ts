import { ApiProperty } from '@nestjs/swagger';

export class ShareResponseDto {
  @ApiProperty({ description: 'Share link URL' })
  shareLink: string;

  @ApiProperty({ description: 'Share token' })
  token: string;

  @ApiProperty({ description: 'Expiration date', nullable: true })
  expireAt: Date | null;
}
