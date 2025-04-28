import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterPhoneDto } from '../dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByPhone(phone: string) {
    return await this.userRepository.findOne({ where: { phone } });
  }

  async createUser(registerDto: RegisterPhoneDto) {
    const user = new User();
    user.phone = registerDto.phone;
    user.password = registerDto.password;
    return await this.userRepository.save(user);
  }
}
