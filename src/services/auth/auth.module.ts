import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpProvider } from 'src/providers/otp/otp.provider';
import { UsersRepository } from 'src/repositories/user.repository';
import { AppConfigService } from 'src/configs/app.config.service';
import { CacheProvider } from 'src/providers/cache/cache.provider';
import { AuthBaseService } from './auth.base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user-entity/user.entity';
import { MyCacheModule } from 'src/providers/cache/cache.module';
import { DatabaseModule } from 'src/database/database.module';
import { QueueService } from 'src/providers/queue/queue.service';
import { MESSSAGE_SERVICE_QUEUE } from 'src/providers/queue';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { QueueMessageService } from 'src/providers/queue/queue.message.service';
import { CustomerClientService } from '../grpc/grpc-client.service';
import { PROTO_PATH_CUSTOMER_AUTH, PROTO_PATH_CUSTOMER} from 'src/common/constants/index.contant';
import { CustomerAuthService } from './customer-auth-service.controller';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_CLIENT_SECRET}`,
      signOptions: {
        expiresIn: `${process.env.JWT_CLIENT_TOKEN_EXPIRED}`,
      },
    }),
    MyCacheModule,
    DatabaseModule,
    // QueueModule.subcribe([
    //   { name: MESSSAGE_SERVICE_QUEUE }
    // ]),
  ],
  providers: [
    AuthService,
    AuthBaseService,
    AccessTokenStrategy,
    UsersRepository,
    AppConfigService,
    OtpProvider,
    QueueService,
    QueueMessageService,
    CustomerClientService,
    {
      provide: MESSSAGE_SERVICE_QUEUE,
      useFactory: ({ messageServiceConnection }: AppConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: messageServiceConnection,
        });
      },
      inject: [AppConfigService],
    },
    {
      provide: MESSSAGE_SERVICE_QUEUE,
      useFactory: ({ messageServiceConnection }: AppConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: messageServiceConnection,
        });
      },
      inject: [AppConfigService],
    },
  ],
  controllers: [CustomerAuthService],
  exports: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
