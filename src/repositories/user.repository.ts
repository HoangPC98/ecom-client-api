import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user-entity/user.entity';
import { BaseAbstractRepository } from './base-abstract.repository';
import { Global, Injectable } from '@nestjs/common';
// import { UserProfile } from 'src/entities/user-entity/user_profile.entity';

@Injectable()
export class UsersRepository extends BaseAbstractRepository<User> {
  readonly account: Repository<User>;
  // readonly profile: Repository<UserProfile>;
  constructor(
    @InjectRepository(User) usersRepository: Repository<User>,
    // @InjectRepository(UserProfile) profileRepository: Repository<UserProfile>,
  ) {
    super(usersRepository);
    this.account = usersRepository;
    // this.profile = profileRepository;
  }
}
