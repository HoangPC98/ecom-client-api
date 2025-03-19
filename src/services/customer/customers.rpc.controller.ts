
import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import Subscriber from './subscriber.entity';
// import CreateSubscriberDto from './dto/createSubscriber.dto';
import { Repository } from 'typeorm';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class CustomersService {
  @GrpcMethod()
  async getAllNews(subscriber: any) {
    console.log('subcriber...', subscriber);
    const subscribers = [
      { id: 1, title: 'kara@gmail.com', body: 'no body', postImage: 'https://www.google.com' },
      { id: 2, title: 'kara123@gmail.com', body: 'no body 23', postImage: 'https://www.google.com' }

    ]
    return { data: subscribers };
  }

  @GrpcMethod()
  async find(subscriber: any) {
    console.log('subcriber...', subscriber);
    const subscribers = [
      { id: 1, title: 'kara@gmail.com', body: 'no body', postImage: 'https://www.google.com' },
      { id: 2, title: 'kara123@gmail.com', body: 'no body 23', postImage: 'https://www.google.com' }

    ]
    return { data: subscribers };
  }

}