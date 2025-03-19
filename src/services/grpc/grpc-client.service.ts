import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PROTO_PATH } from 'src/common/constants/index.contant';
import { CustomersService } from '../customer/customers.rpc.controller';

interface IExampleService {
    getAllNews(id: string): Observable<{ message: string }>;
}

@Injectable()
export class CustomerClientService implements OnModuleInit {
    private customerClientService: CustomersService;

    //   constructor(@Inject('CUSTOMER_CLIENT') private clFient: ClientGrpc) {}
    @Client({
        transport: Transport.GRPC,
        options: {
            url: 'localhost:5001',
            package: 'Customer',
            protoPath: PROTO_PATH,
        },
    })
    client: ClientGrpc;

    onModuleInit() {
        this.customerClientService = this.client.getService<CustomersService>('CustomersService');
    }

    async getAllNews(): Promise<any> {
        const resp = await this.client.getClientByServiceName('CustomersService').getAllNews({ id: 1000 }).toPromise();

        return resp
    }
}