import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterMiniProgramDto, RegisterPhoneDto } from '../dto/login.dto';
import { RegisterByMailDto } from '../dto/mail.dto';
import { UpdateMailDto } from '../dto/auth.dto';
import { isQQMail } from 'src/utils';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

  async getUserByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByOpenId(openid: string) {
    return await this.userRepository.findOne({ where: { openid } });
  }

  async getUserByMail(mail: string) {
    return await this.userRepository.findOne({ where: { mail } });
  }

  async findUserByMail(mail: string) {
    return await this.userRepository.findOneBy({ mail });
  }

  async createUser(registerDto: RegisterPhoneDto) {
    const user = new User();
    user.phone = registerDto.phone;
    user.password = registerDto.password;
    return await this.userRepository.save(user);
  }

  async createUserByMiniProgram(registerDto: RegisterMiniProgramDto) {
    const user = new User();
    user.nickname = registerDto.nickname;
    user.avatar = registerDto.avatar;
    user.openid = registerDto.openid;
    return await this.userRepository.save(user);
  }

  async createUserByMail(registerDto: RegisterByMailDto) {
    const user = new User();
    for (const [key, value] of Object.entries(registerDto)) {
      user[key] = value;
    }
    return await this.userRepository.save(user);
  }

  async findAllId(): Promise<number[]> {
    const ids = await this.userRepository.find({
      select: ['id'],
    });
    return ids.map((item) => item.id);
  }

  async updateUser(updateParams: any) {
    const { userId, ...params } = updateParams;
    const qb = this.userRepository.createQueryBuilder('user');
    qb.update(User)
      .set(params)
      .where('user.id = :userId', { userId })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  /**
   * 修改邮箱
   */
  async updateUserMail(body: UpdateMailDto, userId: number) {
    if (body.mail && !isQQMail(body.mail)) {
      return { code: 500, result: '邮箱格式验证异常，请校验' };
    }
    if (!isQQMail(body.newMail)) {
      return { code: 500, result: '邮箱格式验证异常，请校验' };
    }

    const redisCode = await this.redisService.getMailVerificationCode(
      body.newMail,
    );
    if (!redisCode) {
      return { code: 500, result: '验证码校验失败' };
    }
    if (redisCode !== body.code) {
      return {
        code: 500,
        result: '验证码校验失败',
      };
    }
    await this.redisService.delMailVerificationCode(body.newMail);

    const loginUserInfo = await this.getUserById(userId);
    if (loginUserInfo?.mail && loginUserInfo.mail !== body.mail) {
      return {
        code: 500,
        result: '您的邮箱有误',
      };
    }
    const user = await this.findUserByMail(body.newMail);
    if (user) {
      return {
        code: 500,
        result: '更改的邮箱已被注册',
      };
    }
    if (redisCode !== body.code) {
      return {
        code: 500,
        result: '验证码校验失败',
      };
    }
    await this.updateUser({ mail: body.newMail, userId });
    return {
      code: 200,
      result: '操作成功',
    };
  }
}
