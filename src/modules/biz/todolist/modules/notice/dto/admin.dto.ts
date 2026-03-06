import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import {
  NoticeChannel,
  NoticeStatus,
} from '../../../entities/noticeRecord.entity';
import { NoticeRun } from '../../../entities/noticeRun.entity';

export enum TriggerChannel {
  EMAIL = 'email',
  LETTER = 'letter',
  BOTH = 'both',
}

export class AdminTriggerDto {
  @ApiProperty({ description: '目标日期(YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ description: '仅对指定用户触发', required: false })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({
    description: '触发渠道',
    required: false,
    enum: TriggerChannel,
  })
  @IsOptional()
  @IsEnum(TriggerChannel)
  channel?: TriggerChannel;
}

class AdminTriggerPayload {
  @ApiProperty({ description: '运行ID' })
  runId: number;
  @ApiProperty({ description: '触发时间' })
  runAt: Date;
  @ApiProperty({ description: '发送条数' })
  sentCount: number;
}

export class AdminTriggerResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '返回内容', type: AdminTriggerPayload })
  result: AdminTriggerPayload;
}

export class RecordsListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({ required: false, enum: NoticeStatus })
  @IsOptional()
  @IsEnum(NoticeStatus)
  status?: NoticeStatus;

  @ApiProperty({ required: false, enum: NoticeChannel })
  @IsOptional()
  @IsEnum(NoticeChannel)
  channel?: NoticeChannel;
}

export class RunsListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  limit?: number;
}

class RecordsListPayload {
  @ApiProperty({ description: '当前页码' })
  page: number;
  @ApiProperty({ description: '列表', type: [Object] })
  result: object[];
  @ApiProperty({ description: '总数' })
  total: number;
}

export class RecordsListResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '返回内容', type: RecordsListPayload })
  result: RecordsListPayload;
}

class RunsListPayload {
  @ApiProperty({ description: '当前页码' })
  page: number;
  @ApiProperty({ description: '运行记录', type: [NoticeRun] })
  result: NoticeRun[];
  @ApiProperty({ description: '总数' })
  total: number;
}

export class RunsListResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '返回内容', type: RunsListPayload })
  result: RunsListPayload;
}
