import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();
export default registerAs('app', () => ({
  APP_ENV: process.env.APP_ENV,
  APP_NAME: process.env.APP_NAME,
  APP_VERSION: process.env.APP_VERSION,
  APP_URL: process.env.APP_URL,
  API_BASE_PATH: process.env.API_BASE_PATH,

  JWT_GW_SECRET_KEY: process.env.JWT_GW_SECRET_KEY,
  JWT_GW_TOKEN_EXPIRED: process.env.JWT_GW_TOKEN_EXPIRED,
  JWT_GW_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_GW_REFRESH_TOKEN_SECRET_KEY,
  JWT_GW_REFRESH_TOKEN_EXPIRED: process.env.JWT_GW_REFRESH_TOKEN_EXPIRED,
}));
