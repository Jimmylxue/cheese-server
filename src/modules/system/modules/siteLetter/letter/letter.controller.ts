import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import {
  DelLetterDto,
  LetterListDto,
  UpdateLetterDto,
} from '../dto/letter.dto';
import { sendLetterDto } from '../dto/send.dto';
import { SendLetterService } from '../sendLetter/sendLetter.service';
import { EStatus } from '../entities/sendRecord.entity';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LetterListResponseDto } from '../dto/letterResponse.dto';
import { BaseResponseDto } from 'src/common/dto/response.dto';

@ApiTags('站内信-信息')
@Controller('message')
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly sendLetterService: SendLetterService,
  ) {}

  @ApiOperation({ summary: '查看站内信列表' })
  @ApiResponse({
    description: '单词列表返回',
    type: LetterListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/list')
  async getList(@Body() body: LetterListDto) {
    const letterList = await this.letterService.letterList(body);
    for (const [index, letter] of letterList.result.entries()) {
      const records = await this.sendLetterService.getRecordList({
        letterId: letter.letterId,
      });
      const hasReadCount = records.filter(
        (rec) => rec.status === EStatus.已读,
      ).length;
      const notReadCount = records.filter(
        (rec) => rec.status === EStatus.未读,
      ).length;
      // @ts-ignore
      letterList.result[index].hasReadCount = hasReadCount;
      // @ts-ignore
      letterList.result[index].notReadCount = notReadCount;
    }
    return {
      code: 200,
      result: letterList,
    };
  }

  @ApiOperation({ summary: '添加站内信' })
  @ApiResponse({
    description: '添加站内信返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/add')
  async addLetter(@Body() body: sendLetterDto) {
    const letter = await this.letterService.addLetter(body);
    return {
      code: 200,
      result: letter,
    };
  }

  @ApiOperation({ summary: '更新站内信' })
  @ApiResponse({
    description: '更新站内信返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/update')
  async updateLetter(@Body() body: UpdateLetterDto) {
    const letter = await this.letterService.updateLetter(body);
    if (letter) {
      return {
        code: 200,
        result: '更新成功',
      };
    }
  }

  @ApiOperation({ summary: '删除站内信' })
  @ApiResponse({
    description: '删除站内信返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/del')
  async delLetter(@Body() body: DelLetterDto) {
    await this.letterService.delLetter(body);
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
