import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';
import { PROTO_PATH_CUSTOMER_AUTH, PROTO_PATH_CUSTOMER } from 'src/common/constants/index.contant';


export const grpcClientCustomerServiceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:5001',
    package: 'Customer',
    protoPath: PROTO_PATH_CUSTOMER,
  },
};

export const grpcClientCustomerAuthServiceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:5001',
    package: 'CustomerAuth',
    protoPath: PROTO_PATH_CUSTOMER_AUTH,
  },
};
