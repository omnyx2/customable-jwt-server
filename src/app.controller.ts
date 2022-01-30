import { Controller, Request, Body, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
// import { AuthGuard } from '@nestjs/passport'
import { AuthGuard } from './auth/auth.guard';
// import { LocalAuthGuard } from './auth/local-auth.guard';
// import { AuthService } from './auth/auth.service';
import { UserLoginDto } from './dto/user-login.dto'; 
import { doesNotReject } from 'assert';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private authService: AuthService,
    private readonly configService: ConfigService
  ) {}
  
  // *.env 파일에서 DATABASE_HOST 값을 가져온다 
  @Get('db-host-from-config')
  getDatabaseHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // Guards와 Auth 도입
  @UseGuards(AuthGuard)
  @Post('auth/login')
  async login(@Body() dto: any): Promise<any> {
    return ;
    // const { username, password, affiliatedInstitutions } = dto
    // return dto;
    // return this.authService.login(email, password, affiliatedInstitutions);
  }
}
