import { MiddlewareConsumer, NestModule, Module, Logger, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppService } from './app.service';
import { LoggerMiddleware, LoggerMiddleware2 } from './logger.middleware'
import { UsersModule } from './users.module';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import authConfig from './config/authConfig'
import { validationSchema } from './config/validationSchema';
import { ExceptionModule } from './exception/exception.module';
import { AuthModule } from './auth/auth.module';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

// import { AuthModule } from './auth/auth.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    // 동적으로 모듈을 DEV, Process, Stage를 호출하는 법
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,  
    }),
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({
    //       level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         nestWinstonModuleUtilities.format.nestLike( 'Auth', {
    //         prettyPrint:true}),
    //       )
    //     })
    //  ]
    // }),
    TypeOrmModule.forRoot(),
    TerminusModule,
    HttpModule,
    UsersModule,
    ExceptionModule,
    AuthModule, 
   
  ],
<<<<<<< HEAD
  controllers: [AppController, HealthCheckController],
  providers: [AppService, Logger, HealthCheckController
],
=======
  controllers: [AppController],
  providers: [AppService, Logger],
>>>>>>> parent of a9c0695... release-0.0.1
})

export class AppModule implements NestModule {
  constructor(
    private connection: Connection
  ) {}

  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware, LoggerMiddleware2)
      .exclude({ path: 'users', method: RequestMethod.GET, })
      .forRoutes('/users');
  }
}
