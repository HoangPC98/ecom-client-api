import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcClientCustomerServiceOptions } from './client-options';

interface CustomerService {
  getAllNews(data: {}): Observable<any>;
  find(data: { id: number }): Observable<{ id: number, productId: number, title: string, notes: string }>;
}

// interface CustomerAuthService {
//   login(data: {usr: string, password: string}): Observable<any>;
// }

@Injectable()
export class CustomerClientService implements OnModuleInit {
  private customerService: CustomerService;
  // private customerAuthService: CustomerAuthService;

  @Client(grpcClientCustomerServiceOptions) private readonly clientCustomer: ClientGrpc;
  // @Client(grpcClientCustomerAuthServiceOptions) private readonly clientCustomerAuth: ClientGrpc;


  onModuleInit() {
    this.customerService = this.clientCustomer.getService<CustomerService>('CustomerService');
    // this.customerAuthService = this.clientCustomerAuth.getService<CustomerAuthService>('CustomerAuthService')
  }

  getAllNews() {
    try {
      const resp = this.customerService.getAllNews({});
      return resp
    } catch (error) {
      console.log('Error...........', error)
    }
  }

  // find() {
  //   try {
  //     const resp = this.customerService.find({ id: 2000 });
  //     return resp
  //   } catch (error) {
  //     console.log('Error', error)
  //   }
  // }

  // login() {
  //   try {
  //     const resp = this.customerAuthService.login({usr: '123', password: '123'});
  //     return {}
  //   } catch (error) {
  //     console.log('Error', error)
  //   }
  // }

}