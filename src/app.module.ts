import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './services/auth/auth.module';
import { LoggerModule } from './common/logger/module';
import { ILoggerService } from './common/logger/adapter';
import { AppConfigService } from './configs/app.config.service';
import { LoggerService } from './common/logger/service';
import { AppConfigModule } from './configs/app.config.module';
import { MyCacheModule } from './providers/cache/cache.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { UserModule } from './services/customer/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ClientJwtAuthGuard } from './services/auth/guards/jwt.auth.guard';
import { QueueModule } from './providers/queue/queue.module';
import { MESSSAGE_SERVICE_QUEUE } from './providers/queue';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcModule } from './services/customer/customer.rpc.module';
import { PROTO_PATH } from './common/constants/index.contant';
import { CustomerClientService } from './services/grpc/grpc-client.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    AppConfigModule,
    GrpcModule,
    LoggerModule.regisProviders({
      provide: ILoggerService,
      useFactory: () => {
        return new LoggerService('GatewayAPI', 'info');
      },
      inject: [AppConfigService],
    }),
    // QueueModule.subcribe([
    //   { name: MESSSAGE_SERVICE_QUEUE }
    // ]),
    ClientsModule.register([
      {
        name: 'CUSTOMER_CLIENT',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:5001',
          package: 'Customer',
          protoPath: PROTO_PATH,
        },
      },
    ])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientJwtAuthGuard,
    },
    CustomerClientService
    // {
    //   provide: MESSSAGE_SERVICE_QUEUE,
    //   useFactory: ({ messageServiceConnection }: AppConfigService) => {
    //     return ClientProxyFactory.create({
    //       transport: Transport.RMQ,
    //       options: messageServiceConnection,
    //     });
    //   },
    //   inject: [AppConfigService],
    // },
  ],
  exports: [
    LoggerModule,
    // MESSSAGE_SERVICE_QUEUE
  ],
})
export class AppModule {}
