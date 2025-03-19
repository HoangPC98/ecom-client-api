import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UsersRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(readonly userRepository: UsersRepository) {}
  findAll() {
    return `This action returns all customer`;
  }

  async getMyInfo(uid: number) {
    return await this.userRepository.account.findOneBy({ id: uid });
  }
}
