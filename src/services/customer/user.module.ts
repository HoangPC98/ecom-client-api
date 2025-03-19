import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { MyCacheModule } from 'src/providers/cache/cache.module';

@Module({
  imports: [DatabaseModule, MyCacheModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
