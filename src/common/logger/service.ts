import { existsSync, mkdirSync } from 'node:fs';
import { IncomingMessage, ServerResponse } from 'node:http';

import { Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { gray, green, red, yellow } from 'colorette';
import { format } from 'date-fns';
import * as dotenv from 'dotenv';
import { LevelWithSilent, multistream } from 'pino';
import pino, { Logger } from 'pino';
import pinoHttp, { HttpLogger, Options } from 'pino-http';
import pinoPretty from 'pino-pretty';
import * as rotatingFileStream from 'rotating-file-stream';
import { v4 as uuidv4 } from 'uuid';

import { ILoggerService } from './adapter';
import { ErrorType, MessageType } from './type';
import { ApiException } from '../exeptions/api.excetion';
dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements ILoggerService {
  pino: HttpLogger;
  private app: string;

  constructor(
    private readonly appName: string,
    private readonly logLevel: LevelWithSilent = 'info',
  ) {
    const logFileName = `${appName?.toLowerCase()}.log`;
    const logDir = `./logs/${appName?.toLowerCase()}`;
    if (!existsSync('./logs')) {
      mkdirSync('./logs', { recursive: true });
    }
    const rotatingStream = rotatingFileStream.createStream(`${logFileName}`, {
      interval: process.env.LOGGER_INTERVAL || '1d',
      path: logDir,
      size: process.env.LOGGER_FILE_SIZE || '100M',
      initialRotation: true,
      compress: 'gzip',
    });
    const prettyStream = pinoPretty({
      ignore: 'pid,hostname,filename',
    });
    const ignoreErrStack = process.env.IGNORE_LOG_TRACE_STACK === 'true' ? true : false;
    const logger = pino(
      {
        timestamp: () => `,"time":"${this.getCurrentTimeWithZone()}"`,
        base: null,
        formatters: {
          level: (label) => {
            return { level: label.toUpperCase() };
          },
          log: (logObj) => {
            if (ignoreErrStack) delete logObj.stack;
            return { ...logObj };
          },
        },
      },
      multistream([{ stream: prettyStream }, { stream: rotatingStream }]),
    );
    this.pino = pinoHttp(this.getPinoHttpConfig(logger));
  }

  setApplication(app: string): void {
    this.app = app;
  }

  log(message: string): void {
    this.pino.logger.trace(green(message));
  }

  trace({ message, context, obj = {} }: MessageType): void {
    this.pino.logger.trace([obj, gray(message)].find(Boolean));
  }

  info({ message, context, obj }: MessageType): void {
    this.pino.logger.info([{ message, context, obj }, green(message)].find(Boolean));
  }

  warn({ message, context, obj = {} }: MessageType): void {
    this.pino.logger.warn([obj, yellow(message)].find(Boolean));
  }

  error(error: ErrorType, message?: string, context?: string, request?: any): void {
    const errorResponse = this.getErrorResponse(error);
    const response =
      error instanceof ApiException
        ? { statusCode: error['statusCode'], message: error?.message }
        : errorResponse?.value();
    const type = {
      Error: ApiException.name,
    }[error?.name];
    let finalResponse = {
      ...response,
    };
    if (typeof response === 'string') {
      finalResponse = response;
    }
    const logObj = {
      message: message,
      request: request,
      response: finalResponse,
      type: [type, error?.name].find(Boolean),
      traceid: this.getTraceId(error),
      stack: error?.stack,
    };
    this.pino.logger.error([logObj, red(message)].find(Boolean));
  }

  fatal(error: ErrorType, message?: string, context?: string): void {
    this.pino.logger.fatal(
      {
        ...(error.getResponse() as object),
        context: [context, this.app].find(Boolean),
        type: error.name,
        traceid: this.getTraceId(error),
        stack: error?.stack,
      },
      red(message),
    );
  }

  private getPinoHttpConfig(pinoLogger: Logger): Options {
    return {
      logger: pinoLogger,
      quietReqLogger: true,
      customSuccessMessage: (req: IncomingMessage, res: ServerResponse) => {
        return `request ${res.statusCode >= 400 ? red('error') : green('success')} with status code: ${res.statusCode}`;
      },
      customErrorMessage: (req: IncomingMessage, res: ServerResponse, error: Error) => {
        return `request ${red(error.name)} with status code: ${res.statusCode} `;
      },
      genReqId: (req: IncomingMessage) => {
        return req.headers.traceid;
      },
      customAttributeKeys: {
        // req: 'request',
        // res: 'response',
        err: 'error',
        responseTime: 'timeTaken',
        reqId: 'traceid',
      },
      // serializers: {
      //     err: () => false,
      //     req: (request) => {
      //         return {
      //             method: request.method,
      //             req: request,
      //         };
      //     },
      //     res: pino.stdSerializers.res,
      // },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customProps: (req: any): any => {
        const context = req.context;

        const traceid = [req?.headers?.traceid, req.id].find(Boolean);
        const path = `${req.protocol}://${req.headers.host}${req.url}`;

        this.pino.logger.setBindings({
          traceid,
          context: context,
          path,
          timestamp: this.getCurrentTimeWithZone(),
        });
        return {
          traceid,
          context: context,
          path,
          timestamp: this.getCurrentTimeWithZone(),
        };
      },
      customLogLevel: (req: IncomingMessage, res: ServerResponse, error: Error) => {
        if ([res.statusCode >= 400, error].some(Boolean)) {
          return 'error';
        }
        if ([res.statusCode >= 300, res.statusCode <= 400].every(Boolean)) {
          return 'silent';
        }
        return 'info';
      },
    };
  }

  private getErrorResponse(error: ErrorType): any {
    const isFunction = typeof error?.getResponse === 'function';
    return [
      {
        conditional: typeof error === 'string',
        value: () => new InternalServerErrorException(error).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'string',
        value: () =>
          new ApiException(error.getResponse(), [error.getStatus(), error['status']].find(Boolean)).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'object',
        value: () => error?.getResponse(),
      },
      {
        conditional: [error?.name === Error.name, error?.name == TypeError.name].some(Boolean),
        value: () => new InternalServerErrorException(error.message).getResponse(),
      },
    ].find((c) => c.conditional);
  }

  private getCurrentTimeWithZone(): string {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  }

  private getTraceId(error): string {
    if (typeof error === 'string') return uuidv4();
    return [error?.traceid, this.pino.logger.bindings()?.traceid].find(Boolean);
  }
}
