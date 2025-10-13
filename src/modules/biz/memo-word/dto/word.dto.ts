import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ListWordBody {
  @ApiProperty({ description: '英文单子', example: 'apple' })
  @IsOptional()
  @IsString()
  word: string;

  @ApiProperty({ description: '中文翻译', example: '苹果' })
  @IsOptional()
  @IsString()
  chineseMean: string;

  @ApiProperty({ description: '排序', example: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort: string;

  @ApiProperty({ description: '每页大小', example: 10 })
  @IsNotEmpty()
  @IsInt()
  pageSize: number;

  @ApiProperty({ description: '页码', example: 1 })
  @IsNotEmpty()
  @IsInt()
  page: number;
}

export class SaveWordBody {
  @ApiProperty({ description: '英文单词', example: 'apple' })
  @IsNotEmpty()
  @IsString()
  word: string;

  @ApiProperty({ description: '中文翻译', example: '苹果' })
  @IsNotEmpty()
  @IsString()
  chineseMean: string;
}

export class UpdateWordBody {
  @ApiProperty({ description: '单词笔记', example: '这是记得第一个笔记' })
  @IsOptional()
  @IsString()
  personalNote: string;

  @ApiProperty({ description: '是否已记牢', example: true })
  @IsOptional()
  @IsBoolean()
  isMastered: boolean;

  @ApiProperty({ description: '用户单词id', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userWordId: number;
}

export class DelWordBody {
  @ApiProperty({ description: '用户单词id', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userWordId: number;
}
