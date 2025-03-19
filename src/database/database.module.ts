import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { customerDatabaseConfig } from 'src/database/datasource.config';
import { UsersRepository } from '../repositories/user.repository';
import { User } from 'src/entities/user-entity/user.entity';
import { UserProfile } from 'src/entities/user-entity/user_profile.entity';
import { Session } from 'src/entities/user-entity/session.entity';

@Module({
  imports: [TypeOrmModule.forRoot(customerDatabaseConfig), TypeOrmModule.forFeature([User, UserProfile, Session])],
  providers: [UsersRepository],
  exports: [TypeOrmModule, UsersRepository],
})
export class DatabaseModule {}
