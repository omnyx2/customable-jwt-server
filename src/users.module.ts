import { Logger, Module } from '@nestjs/common';
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
  
<<<<<<< HEAD
  providers: [
    UsersService, 
    EmailService, 
    Logger, 
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // }],
  ],
=======
  providers: [UsersService, EmailService, Logger],
>>>>>>> parent of a9c0695... release-0.0.1
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}