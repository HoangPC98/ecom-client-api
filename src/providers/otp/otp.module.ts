import { Global, Module } from '@nestjs/common';
import { OtpProvider } from './otp.provider';

@Module({
  providers: [OtpProvider],
  exports: [OtpProvider],
})
export class OtpModule {}
