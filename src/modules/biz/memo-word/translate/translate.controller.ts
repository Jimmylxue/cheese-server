import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  // UseGuards,
} from '@nestjs/common';

// import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import {
  // ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TranslateService } from './translate.service';
import { FanYiDto, TranslateResponseDto } from '../dto/translate.dto';

@ApiTags('翻译模块')
@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @ApiOperation({ summary: '翻译接口' })
  @ApiResponse({
    description: '保存返回',
    type: TranslateResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard)
  @Post('/base')
  async baseTranslate(@Body() req: FanYiDto) {
    return await this.translateService.translate(req);
  }
}
