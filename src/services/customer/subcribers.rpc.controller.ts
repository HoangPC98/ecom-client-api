
import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import Subscriber from './subscriber.entity';
// import CreateSubscriberDto from './dto/createSubscriber.dto';
import { Repository } from 'typeorm';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class SubscribersService {
  //   constructor(
  //     @InjectRepository(Subscriber)
  //     private subscribersRepository: Repository<Subscriber>,
  //   ) {}

  @GrpcMethod()
  async addSubscriber(subscriber: any) {
    return { message: 'Subscriber added' };
  }

  @GrpcMethod()
  async getAllSubscribers(subscriber: any) {
    console.log('subcriber...', subscriber);
    const subscribers = [
      { id: 1, email: 'kara@gmail.com', name: 'no name' },
      { id: 2, email: 'kara123@gmail.com', name: 'no name1 23' }

    ]
    return { data: subscribers };
  }

}