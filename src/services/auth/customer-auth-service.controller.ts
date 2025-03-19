import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { LoginByUsrPwdReq } from '../auth/dto/login.dto';
import { ILoginResp } from 'src/common/interfaces/auth.interface';

@Controller()
// export class CustomerService implements ICustomerService {
export class CustomerAuthService {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod()
  async login(dto: LoginByUsrPwdReq): Promise<ILoginResp> {
    console.log('DTO...Login...', dto)
    const res = this.authService.loginByUsr(dto.usr, dto.password)
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

  // @GrpcMethod()
  // async find(subscriber: any): Promise<any> {
  //   console.log('find...', subscriber);
  //   const recipes = { id: 1, title: 'kara@gmail.com', notes: "123" };
  //   return recipes;
  // }

}