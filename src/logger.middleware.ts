import { Injectable, NestMiddleware, Inject, Logger, LoggerService, } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor (
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}


@Injectable()
export class LoggerMiddleware2 implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}