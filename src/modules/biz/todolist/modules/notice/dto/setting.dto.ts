import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { BaseResponseDto } from 'src/common/dto/response.dto';

export class UpdateSettingDto {
  @ApiProperty({ description: '是否开启邮件通知', required: false })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiProperty({ description: '是否开启站内信通知', required: false })
  @IsOptional()
  @IsBoolean()
  letterEnabled?: boolean;

  @ApiProperty({
    description: '通知时间(HH:mm)，24小时制，步长30分钟',
    required: false,
    example: '08:30',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):(00|30)$/)
  preferredTime?: string;
}

class SettingPayload {
  @ApiProperty({ description: '是否开启邮件通知' })
  emailEnabled: boolean;

  @ApiProperty({ description: '是否开启站内信通知' })
  letterEnabled: boolean;

  @ApiProperty({ description: '通知时间(HH:mm)' })
  preferredTime: string;
}

export class SettingResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '返回内容', type: SettingPayload })
  result: SettingPayload;
}

export class UpdateSettingResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '是否成功' })
  result: boolean;
}
