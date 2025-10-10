import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterMiniProgramDto, RegisterPhoneDto } from '../dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}
