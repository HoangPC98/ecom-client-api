import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribersService } from './subcribers.rpc.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CustomersService } from './customers.rpc.controller';
import { PROTO_PATH } from 'src/common/constants/index.contant';
 
@Module({
    controllers: [SubscribersService, CustomersService],
    providers: [
      // {
      //   provide: 'SUBSCRIBERS_PACKAGE',
      //   useFactory: () => {
      //     return ClientProxyFactory.create({
      //       transport: Transport.GRPC,
      //       options: {
      //         package: 'subcriber',
      //         protoPath: 'src/proto/subcriber.proto',
      //       },
      //     })
      //   },
      //   inject: [],
      // },
      // {
      //   provide: 'CUSTOMER_PACKAGE',
      //   useFactory: () => {
      //     return ClientProxyFactory.create({
      //       transport: Transport.GRPC,
      //       options: {
      //         package: 'Customer',
      //         protoPath: PROTO_PATH,
      //       },
      //     })
      //   },
      //   inject: [],
      // }
    ],
  })
export class GrpcModule {}