import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './user.service';
import { v4 as uuidv4 } from 'uuid';
import { QrCodeService } from 'src/common/service/qrcode.service';
import { CheckLoginDto, ScanCodeDto } from '../dto/scan.dto';
import { RedisService } from 'src/modules/redis/redis.service';
import { AuthService } from './auth.service';

type TAuth_Code_Type = {
  status: 'pending' | 'scanned' | 'confirmed';
  userId: null | number;
  token: string;
  createTime: number;
  access_token: null | string;
  nickname?: string;
  avatar?: string;
};

@Injectable()
export class ScanAuthService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService,
    private qrCodeService: QrCodeService,
    private readonly redisService: RedisService,
  ) {}

  async generateQrCode() {
    const qr_id = uuidv4();
    const token = uuidv4();

    const qrContent = JSON.stringify({
      qr_id: qr_id,
      type: 'login',
    });

    const qr_svg = await this.qrCodeService.generateQRCodeSVG(qrContent);

    const qr_id_key = `scan_auth_${qr_id}`;

    await this.redisService.set(
      qr_id_key,
      {
        status: 'pending',
        userId: null,
        token: token,
        createTime: Date.now(),
        access_token: null,
      },
      90,
    );

    return {
      code: 200,
      result: {
        qr_svg,
        token,
        qr_id,
      },
    };
  }

  async scanCode(scanCodeDto: ScanCodeDto, userId: number) {
    const qr_id_key = `scan_auth_${scanCodeDto.qr_id}`;
    const qrSession = await this.redisService.get<TAuth_Code_Type>(qr_id_key);
    if (!qrSession) {
      return {
        code: 500,
        message: '二维码不存在或已过期',
      };
    }
    if (qrSession.status !== 'pending') {
      return {
        code: 500,
        message: '二维码状态无效',
      };
    }
    const user = await this.usersService.getUserById(userId);
    qrSession.status = 'scanned';
    qrSession.userId = userId;
    qrSession.avatar = user?.avatar;
    qrSession.nickname = user?.nickname;
    await this.redisService.set(qr_id_key, { ...qrSession }, 90);
    return {
      code: 200,
      result: true,
      message: '扫码成功',
    };
  }

  async confirm(scanCodeDto: ScanCodeDto, userId: number) {
    const qr_id_key = `scan_auth_${scanCodeDto.qr_id}`;
    const qrSession = await this.redisService.get<TAuth_Code_Type>(qr_id_key);
    if (!qrSession) {
      return {
        code: 500,
        message: '二维码不存在或已过期',
      };
    }
    if (qrSession.status !== 'scanned') {
      return {
        code: 500,
        message: '请先扫描二维码',
      };
    }
    qrSession.status = 'confirmed';
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      return {
        code: 500,
        message: '用户不存在',
      };
    }
    const access_token = await this.authService.createToken(user);
    await this.redisService.set(qr_id_key, { ...qrSession, access_token }, 90);
    return {
      code: 200,
      message: '确认授权成功',
    };
  }

  async checkLogin(query: CheckLoginDto) {
    const { qr_id, token } = query;
    const qr_id_key = `scan_auth_${qr_id}`;
    const qrSession = await this.redisService.get<TAuth_Code_Type>(qr_id_key);

    if (!qrSession) {
      return {
        code: 502,
        message: '二维码不存在，请刷新',
        result: {
          reloadFlag: true,
        },
      };
    }

    if (qrSession.token !== token) {
      return {
        code: 502,
        message: 'token不匹配',
        result: {
          reloadFlag: true,
        },
      };
    }

    if (qrSession.status === 'confirmed') {
      const user = await this.usersService.getUserById(qrSession.userId!);
      await this.redisService.del(qr_id_key);
      return {
        code: 200,
        result: {
          status: qrSession.status,
          access_token: qrSession.access_token,
          nickname: qrSession.nickname,
          avatar: qrSession.avatar,
          user,
          reloadFlag: false,
        },
      };
    } else {
      return {
        code: 200,
        result: {
          status: qrSession.status,
          nickname: qrSession.nickname,
          avatar: qrSession.avatar,
          reloadFlag: false,
        },
      };
    }
  }
}
