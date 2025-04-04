import { Transport, ClientOptions } from '@nestjs/microservices';
import {  PROTO_PATH_CUSTOMER } from 'src/common/constants/index.contant';


export const grpcClientCustomerServiceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:5001',
    package: 'Customer',
    protoPath: PROTO_PATH_CUSTOMER,
  },
};
