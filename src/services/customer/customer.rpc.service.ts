
import { Controller, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LoginByUsrPwdReq, SignUpReq } from '../auth/dto/login.dto';
import { ILoginResp, ISignUpRes } from 'src/common/interfaces/auth.interface';
import { Customer } from 'src/interfaces/protos/customer/customer';

@Controller()
// export class CustomerService implements ICustomerService {
export class CustomerService {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @GrpcMethod()
  async login(dto: Customer.LoginT1Req): Promise<Customer.LoginT1Res> {
    console.log('DTO...Login...', dto)
    const res = this.authService.loginByUsr(dto)
    return res;
  }

  @GrpcMethod()
  async getAllNews(subscriber: any): Promise<any> {
    console.log('getAllNews...', subscriber);
    const news = [
      { id: '1', title: 'kara@gmail.com', body: 'no body', postImage: 'https://www.google.com' },
      { id: '2', title: 'kara123@gmail.com', body: 'no body 23', postImage: 'https://www.google.com' }
    ]
    return { news };
  }

  @GrpcMethod()
  async signUp(dto: Customer.SignUpT1Req): Promise<Customer.SignUpT1Res> {
    console.log('DTO...SignUp...', dto)
    const res = this.authService.signUpByUsr(dto)
    return res;
  }

  @GrpcMethod()
  async find(subscriber: any): Promise<any> {
    console.log('find...', subscriber);
    const recipes = { id: 1, title: 'kara@gmail.com', notes: "123" };
    return recipes;
  }

}