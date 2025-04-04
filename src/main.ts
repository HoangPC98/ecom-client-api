import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ILoggerService } from './common/logger/adapter';
import { GatewayInterceptor } from './common/interceptors/with-token.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { MicroserviceOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { rabbitmqUri } from 'src/providers/queue';
import { PROTO_PATH_CUSTOMER } from './common/constants/index.contant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appName = 'GatewayAPI';
  const appPort = process.env.REST_API_PORT || 8080;
  const rpcEndpoint =  '0.0.0.0:5001';
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  };
  // const pathOut = SUBMODULE_OUTSIDE_REPO_PATH;
  // console.log('pathOut', pathOut);
  const loggerService = app.get(ILoggerService);
  app.useLogger(loggerService);
  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });
  app.enableCors(options);
  // app.useGlobalInterceptors(new GatewayInterceptor(loggerService));
  // app.useGlobalFilters(new AllExceptionFilter(loggerService));

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
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
  console.log('rpcEndpoint', rpcEndpoint);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: { 
      package: 'Customer',
      protoPath: PROTO_PATH_CUSTOMER,
      url: rpcEndpoint,
    },
  });

  await app.startAllMicroservices();
  console.log(`==> ${appName} is listening for messages on RabbitMQ.`);

  await app.listen(appPort);
  console.log(`==> ${appName} is start successfully on port: ${appPort}...`);
}
bootstrap();
