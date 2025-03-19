import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { IResponse } from '../interfaces/request-response.interface';
import { ILoggerService } from '../logger/adapter';
import { UserAuthJwtDto } from 'src/services/auth/dto/token.dto';
// import { TranslationService } from 'libs/translation/src';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    // private readonly translateService: TranslationService,
    private readonly loggerService: ILoggerService,
  ) {}

  async catch(exception: HttpException | any, host: ArgumentsHost): Promise<void> {
    const response = host.switchToHttp().getResponse();
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const requestUser: UserAuthJwtDto = request['user'];
    const exceptionResp = exception.response?.response ? exception.response.response : exception.response;
    const isMultibankResp = exceptionResp?.err_code && exceptionResp?.err_desc ? true : false;
    const logExeptionObject = process.env.LOG_EXCEPTION_OBJ == 'true' ? true : false;
    const exceptionMsg = exceptionResp?.errMsg;

    console.log('===> EXCEPTION:', logExeptionObject ? exception : '{ EXEPTION_COLAPSED }');

    const respStatus = exception.status ? exception.status : 400;
    const httpStatus = respStatus;
    const contextName = exception.name;
    exception.path = request.url;

    const result: IResponse = {
      statusCode: exception.status,
      data: null,
      message: exceptionMsg,
    };

    if (!result.statusCode) result.statusCode = 400;

    exception['_request'] = request;
    this.loggerService.error(exception, exceptionMsg, contextName, {
      method: request.method.toUpperCase(),
      url: request.url,
      body: request.body,
    });
    return response.status(httpStatus).json(result);
  }
}
