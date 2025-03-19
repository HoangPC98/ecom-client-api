
import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import Subscriber from './subscriber.entity';
// import CreateSubscriberDto from './dto/createSubscriber.dto';
import { Repository } from 'typeorm';
import { GrpcMethod } from '@nestjs/microservices';
import {NewsList, Recipe, ICustomersService} from '../../interfaces/customers/customer'
import { Observable } from 'rxjs';
@Controller()
export class CustomersService implements ICustomersService {
  @GrpcMethod()
  async getAllNews(subscriber: any): Promise<NewsList> {
    console.log('subcriber...', subscriber);
    const news = [
      { id: '1', title: 'kara@gmail.com', body: 'no body', postImage: 'https://www.google.com' },
      { id: '2', title: 'kara123@gmail.com', body: 'no body 23', postImage: 'https://www.google.com' }
    ]
    return { news };
  }

  @GrpcMethod()
  async find(subscriber: any): Promise<Recipe> {
    console.log('subcriber...', subscriber);
    const recipes = { id: 1, title: 'kara@gmail.com', notes: "123" };
    return recipes;
  }

}