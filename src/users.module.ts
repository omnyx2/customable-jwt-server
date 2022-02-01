import { Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {EmailService} from './email/email.service'
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
// import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './roles/roles.guard';
 
@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
    load: [emailConfig],
    isGlobal: true,
    validationSchema,
    
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  
  providers: [
    UsersService, 
    EmailService, 
    Logger, 
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // }],
  ],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}