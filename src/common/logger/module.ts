import { DynamicModule, Module } from '@nestjs/common';

import { ILoggerService } from './adapter';

@Module({
  // imports: [AppConfigModule],
})
export class LoggerModule {
  static regisProviders(providers): DynamicModule {
    return {
      module: LoggerModule,
      providers: [providers],
      exports: [ILoggerService],
    };
  }
}
