import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { MESSSAGE_SERVICE, rabbitmqUri } from '.';

interface QueueRegisterOptions {
  name: string;
}

@Global()
@Module({})
export class QueueModule {
  static readonly serviceName = MESSSAGE_SERVICE;
  static subcribe(queues: Array<QueueRegisterOptions>): DynamicModule {
    return ClientsModule.registerAsync(
      queues.map((queue) => ({
        name: this.serviceName,
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [rabbitmqUri()],
            queue: queue.name,
            exchange: '123',
            queueOptions: {
              durable: true,
            },
            noAck: true,
            prefetchCount: 1,
          },
        }),
      })),
    );
  }
}
