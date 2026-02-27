import { IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ShareType } from '../../../entities/imgShare.entity';

export enum ShareValidityPeriod {
  ONE_DAY = 1,
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30,
  PERMANENT = -1,
}

export class CreateShareDto {
  @ApiProperty({ enum: ShareType, description: 'Share type: file or folder' })
  @IsEnum(ShareType)
  type: ShareType;

  @ApiProperty({ description: 'Resource or Folder ID' })
  @IsInt()
  targetId: number;

  @ApiProperty({
    enum: ShareValidityPeriod,
    description: 'Validity period in days (0 for permanent)',
  })
  @IsInt()
  validity: number;
}
