import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ILoggerService } from './common/logger/adapter';
import { GatewayInterceptor } from './common/interceptors/with-token.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { MicroserviceOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { MESSSAGE_SERVICE_QUEUE, rabbitmqUri } from 'src/providers/queue';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appName = 'GatewayAPI';
  const appPort = +process.env.APP_PORT;
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  };

  const loggerService = app.get(ILoggerService);
  app.useLogger(loggerService);

  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });

  app.enableCors(options);
  app.useGlobalInterceptors(new GatewayInterceptor(loggerService));

  // app.useGlobalFilters(new AllExceptionFilter(loggerService));

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      // stopAtFirstError: true
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUri()],
      exchange: '123',
      queue: 'hoangpc',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1
    },
  } as RmqOptions);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: { 
      package: 'subcriber',
      protoPath: 'src/proto/subcriber.proto',
      url: 'localhost:50050',
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: { 
      package: 'customer',
      protoPath: 'src/proto/customer.proto',
      url: 'localhost:50052',
    },
  });

  await app.startAllMicroservices();
  console.log(`==> ${appName} is listening for messages on RabbitMQ.`);

  await app.listen(appPort);
  console.log(`==> ${appName} is start successfully on port: ${appPort}...`);
}
bootstrap();
