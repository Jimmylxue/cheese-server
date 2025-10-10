import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CheckLoginDto,
  CheckLoginResponseDto,
  CommonScanCodeResponseDto,
  GenerateQrCodeResponseDto,
  ScanCodeDto,
} from '../dto/scan.dto';
import { ScanAuthService } from '../services/scan.service';

@ApiTags('扫码授权登录')
@Controller('scan_auth')
export class ScanAuthController {
  constructor(private scanService: ScanAuthService) {}

  @ApiOperation({ summary: '生成授权二维码' })
  @ApiResponse({
    description: '生成授权二维码返回',
    type: GenerateQrCodeResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('qr_code')
  async generateQrCode() {
    return await this.scanService.generateQrCode();
  }

  @ApiOperation({ summary: '扫码端扫码后调用' })
  @ApiResponse({
    description: '扫码端确认授权返回',
    type: CommonScanCodeResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('scan')
  async scanCode(@Body() scanCodeDto: ScanCodeDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.scanService.scanCode(scanCodeDto, userId);
  }

  @ApiOperation({ summary: '扫码端确认授权' })
  @ApiResponse({
    description: '扫码端确认授权返回',
    type: CommonScanCodeResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('confirm')
  async confirm(@Body() scanCodeDto: ScanCodeDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.scanService.confirm(scanCodeDto, userId);
  }

  @ApiOperation({ summary: '轮询检查状态' })
  @ApiResponse({
    description: '轮询接口返回',
    type: CheckLoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('check_login')
  async checkLogin(@Query() query: CheckLoginDto) {
    return await this.scanService.checkLogin(query);
  }
}
