import * as Joi from '@hapi/joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './app.config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().default('E-Wallet'),
        APP_CLIENT_NAME: Joi.string().default('E-Wallet-Client-API'),
        API_BASE_PATH: Joi.string().default('api'),
        APP_ENV: Joi.string().valid('development', 'production', 'staging').default('development'),
        APP_URL: Joi.string().default('http://localhost'),
        APP_CLIENT_PORT: Joi.number().default(3002),
        APP_CMS_PORT: Joi.number().default(3003),
        APP_CONSUMER_PORT: Joi.number().default(3004),
        APP_PAYMENT_LINK_PORT: Joi.number().default(3005),
        APP_BILL_PAYMENT_SERVICE_PORT: Joi.number().default(3006),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
