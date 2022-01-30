import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,
    {
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike('Auth', { prettyPrint: true }),
            ),
          }),
        ],
      })
    })
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
}));
  
  await app.listen(3000);
}
bootstrap();