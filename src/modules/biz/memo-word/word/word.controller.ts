import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WordService } from './word.service';
import {
  DelWordBody,
  ListWordBody,
  SaveWordBody,
  UpdateWordBody,
} from '../dto/word.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WordsListResponseDto } from '../dto/response.dto';
import { BaseResponseDto } from 'src/common/dto/response.dto';

@ApiTags('单词鸭鸭')
@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @ApiOperation({ summary: '查看已存单词列表' })
  @ApiResponse({
    description: '单词列表返回',
    type: WordsListResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/list')
  async wordList(@Body() req: ListWordBody, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.wordService.getUserWords(
      {
        ...req,
      },
      userId,
    );
  }

  @ApiOperation({ summary: '用户保存单词' })
  @ApiResponse({
    description: '保存返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/save')
  async saveWords(@Body() req: SaveWordBody, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.wordService.saveWords(
      {
        ...req,
      },
      userId,
    );
  }

  @ApiOperation({ summary: '更新单词信息' })
  @ApiResponse({
    description: '更新返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/update')
  async updateWords(@Body() req: UpdateWordBody) {
    return await this.wordService.updateWord({
      ...req,
    });
  }

  @ApiOperation({ summary: '删除保存单词句子' })
  @ApiResponse({
    description: '删除返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/del')
  async delWords(@Body() req: DelWordBody) {
    return await this.wordService.delWords(req);
  }
}
