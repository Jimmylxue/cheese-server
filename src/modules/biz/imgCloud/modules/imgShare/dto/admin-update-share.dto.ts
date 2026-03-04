import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminUpdateShareDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Type(() => Date)
  expireAt?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  accessCode?: string | null;
}
