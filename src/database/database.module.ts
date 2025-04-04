import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { customerDatabaseConfig } from 'src/database/datasource.config';
import { UsersRepository } from '../repositories/user.repository';
import { User } from 'src/database/entities/user-entity/user.entity';
// import { UserProfile } from 'src/entities/user-entity/user_profile.entity';

@Module({
  imports: [TypeOrmModule.forRoot(customerDatabaseConfig), TypeOrmModule.forFeature([User])],
  providers: [UsersRepository],
  exports: [TypeOrmModule, UsersRepository],
})
export class DatabaseModule {}
