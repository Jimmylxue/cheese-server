import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SendLetterService } from './sendLetter.service';
import {
  recordListDto,
  sendAllDto,
  sendSomeDto,
  userReadDto,
  userRecordDto,
} from '../dto/send.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { UsersService } from 'src/modules/auth/services/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import { LetterRecordResponseDto } from '../dto/sendResponse.dto';
@ApiTags('站内信-记录')
@Controller('letter')
export class SendLetterController {
  constructor(
    private readonly sendLetterService: SendLetterService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: '发送信息给某个人' })
  @ApiResponse({
    description: '发送信息给某个人返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/sendSome')
  async sendSome(@Body() body: sendSomeDto) {
    const records = await this.sendLetterService.sendToSome(
      body.letterId,
      body.userIds,
    );
    if (records) {
      return {
        code: 200,
        result: records.raw.affectedRows + '条数据操作成功',
      };
    }
  }

  @ApiOperation({ summary: '发送信息给所有人' })
  @ApiResponse({
    description: '发送信息给所有人返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @Post('/sendAll')
  async sendAll(@Body() body: sendAllDto) {
    const allUserIds = await this.userService.findAllId();
    const records = await this.sendLetterService.sendToSome(
      body.letterId,
      allUserIds,
    );
    if (records) {
      return {
        code: 200,
        result: records.raw.affectedRows + '条数据操作成功',
      };
    }
  }

  @ApiOperation({ summary: '查看某条信发送记录（发送给了什么人）' })
  @ApiResponse({
    description: '发送记录返回',
    type: LetterRecordResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/record')
  async recordList(@Body() body: recordListDto) {
    const data = await this.sendLetterService.getRecordList(body);
    return {
      code: 200,
      result: data,
    };
  }

  // @ApiOperation({ summary: '' })
  // @ApiResponse({
  //   description: '',
  //   type: BaseResponseDto,
  // })
  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard)
  // @Post('/record/user')
  // async recordUser(@Body() body: recordUserDto) {
  //   const records = await this.sendLetterService.getRecordUser(body);
  //   return {
  //     code: 200,
  //     result: records,
  //   };
  // }

  /**
   * 获取用户的 消息列表
   */
  @ApiOperation({ summary: '获取用户的 消息列表' })
  @ApiResponse({
    description: '获取用户的消息列表返回',
    type: LetterRecordResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/user/record')
  async userRecord(@Body() body: userRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.sendLetterService.getUserLetter(body, userId);
    return {
      code: 200,
      result: records.filter((item) => item.letter.platform === body.platform),
    };
  }

  /**
   * 手动更新 阅读状态
   */
  @ApiOperation({ summary: '手动更新阅读状态' })
  @ApiResponse({
    description: '操作成功返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/user/read')
  async userRead(@Body() body: userReadDto, @Req() auth) {
    await this.sendLetterService.updateRecord(body);
    return {
      code: 200,
      result: '操作成功',
    };
  }
}
