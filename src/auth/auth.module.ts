
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users.module';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users.service';

@Module({
  imports: [],
  providers: [AuthService],
  exports: [AuthService]

})
export class AuthModule {}
