import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  public context: string;
  public error: string | object;
  public traceid: string;
  public statusCode: number;
  public code?: string;
  public config?: unknown;
  public user?: string;

  constructor(error: string | object = 'Something went wrong. Please try again.', status?: HttpStatus) {
    super(error || 'Bad Request', status || 400);
  }
}
