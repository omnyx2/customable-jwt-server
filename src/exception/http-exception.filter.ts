import { 
  ArgumentsHost, Catch, ExceptionFilter,
  Logger,
  HttpException, 
  InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) { }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    
    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack
    }
    this.logger.error(log);
    res
      .status((exception as HttpException).getStatus())
      .json(response);
  }
}