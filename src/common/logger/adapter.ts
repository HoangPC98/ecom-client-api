import { HttpLogger } from 'pino-http';

import { ErrorType, MessageType } from './type';
import { Global, Inject, Injectable } from '@nestjs/common';

@Injectable()
export abstract class ILoggerService<T extends HttpLogger = HttpLogger> {
  abstract pino: T;
  abstract setApplication(app: string): void;
  /**
   * @deprecated The method should be use only in main.ts, this log won't be saved in elastic, only sdout
   */
  abstract log(message: string): void;
  /**
   * this log won't be saved in elastic, only sdout
   */
  abstract trace({ message, context, obj }: MessageType): void;
  abstract info({ message, context, obj }: MessageType): void;
  abstract warn({ message, context, obj }: MessageType): void;
  abstract error(error: Error | ErrorType, message?: string, context?: string, request?: any): void;
  abstract fatal(error: ErrorType, message?: string, context?: string): void;
}
