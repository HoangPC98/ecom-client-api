import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { IResponse } from '../interfaces/request-response.interface';
import { ILoggerService } from '../logger/adapter';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class GatewayInterceptor<T> implements NestInterceptor<T, IResponse> {
  private isLowSecureForTesting: boolean;
  private mifimizeLogResponseContexts = process.env.MINIMIZE_LOG_RESPONSE_FNC_CONTEXTS || '';
  constructor(private readonly loggerService: ILoggerService) {
    this.isLowSecureForTesting =
      process.env.LOW_SECURE_FOR_TESTING && process.env.LOW_SECURE_FOR_TESTING.toString() === 'true' ? true : false;
  }
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<IResponse> {
    const request = executionContext.switchToHttp().getRequest();

    const fnc = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;
    const context = { fnc };
    if (request.body?.transactionId) context['Transaction'] = request.body?.transactionId;
    if (request?.user?.phoneNumber) context['phoneNumber'] = request.user.phoneNumber;
    if (!request.headers?.traceid) {
      request.headers.traceid = uuidv4();
      request.id = request.headers.traceid;
    }

    return next.handle().pipe(
      map((data) => {
        const response = executionContext.switchToHttp().getResponse();
        const dataResp = data || null;
        const responseStatusCodeIn: number = 201;

        const body = {
          data: typeof dataResp === 'string' ? dataResp : instanceToPlain<T>(dataResp, {}),
          statusCode: responseStatusCodeIn,
          message: dataResp?.err_desc || dataResp?.message || '',
        };

        this.loggerService.info({
          obj: {
            ctx: context,
            request: {
              method: request.method.toUpperCase(),
              url: request.url,
              body: request.body,
            },
            response: this.mifimizeLogResponseContexts.toString().includes(context.fnc.toString())
              ? { ...body, data: '{Collapsed...}' }
              : body,
          },
          context: context.toString(),
        });
        return body;
      }),
    );
  }
}
