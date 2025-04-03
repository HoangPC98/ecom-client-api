import { Module } from '@nestjs/common';
import { CustomerService } from './customer.rpc.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
 
@Module({
    imports: [
      AuthModule
    ],
    controllers: [CustomerService],
  })
export class CustomerModule {}