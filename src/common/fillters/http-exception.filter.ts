import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  message?: string;
  code?: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let code: number = status;

    if (typeof exceptionResponse === 'object') {
      const typedResponse = exceptionResponse as ExceptionResponse;
      message = typedResponse.message || exception.message;
      code = typedResponse.code || status;
    } else {
      message = exceptionResponse;
    }

    response.status(status).json({
      code,
      result: null,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
