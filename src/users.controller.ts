import { Body, 
  Controller, 
  Headers,
  UseFilters,
  Get, 
  Param, 
  Post, 
  Query, 
  ParseIntPipe, 
  DefaultValuePipe, 
  HttpStatus,
  InternalServerErrorException,
  Inject,
  SetMetadata,
  Logger,
  UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { TokenLoginDto } from './dto/token-login.dto'
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { ValidationPipe } from './validation.pipe';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { AuthService } from './auth/auth.service';
import { request } from 'express';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthGuard } from './auth/auth.guard';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GetUserDto } from './dto/get-user.dto';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';
import { RolesGuard } from './roles/roles.guard';


@Controller('users')
export class UsersController {
  constructor(
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger2: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  private roles: Role[]
  // private printWinstonLog(dto: any) {
  //   console.log(this.logger.name);

  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }
  private printLoggerServiceLog(m, dto) {
    switch(m) {
      case('e'): this.logger.error('error: ' + JSON.stringify(dto)); break;
      case('w'): this.logger.warn('warn: ' + JSON.stringify(dto)); break;
      case('l'): this.logger.log('log: ' + JSON.stringify(dto)); break;
      case('v'): this.logger.verbose('verbose: ' + JSON.stringify(dto)); break;
      case('d'): this.logger.debug('debug: ' + JSON.stringify(dto)); break;
      default: break;
    }
  }
  // Guard 추가 인가후, system level 2 above or 3일때의 본인
  // 특정 유저 정보 조회, token에 유저의 정보가 표현되어 있지만
  // Rest 명세를 위해서 id에 값을 담아준다
  // UserGuards를 쓸때 순서를 지켜줘야 된다 가드 실행 순서에 따라 데이터 붙여주는 요건이 조금 다르기 때문이다.
  @Get('/:affiliatedInstitution/:id')
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  async getUserInfoByAdmin(
    @Headers() headers: any, 
    @Param() dto: GetUserDto): Promise<UserInfo> {

    this.printLoggerServiceLog('l',dto);
    const { id, affiliatedInstitution }: GetUserDto = dto;
    const user: User = await this.usersService.getUserInfoById(id, affiliatedInstitution);
    
    const { 
    //  accessLevel,
      password,
      signupVerifyToken,
      jwtRefreshToken,
      ...payload
    } = user;
    return payload;
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('/admin/:affiliatedInstitution/:id')
  async getUserInfo(
    @Headers() headers: any, 
    @Param() dto: GetUserDto): Promise<UserInfo> {

    // this.printLoggerServiceLog('l',{ dto });
    const { id, affiliatedInstitution }: GetUserDto = dto
   
    return this.usersService.getUserInfoById(id, affiliatedInstitution);
  }

  // system level 2 above
  // 전체 유저 조회
  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard) 
  findAll(
    // 유저 명수를 페이징 기법을 통해 받는다
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    this.printLoggerServiceLog('w',{ message: "who are you? attacking"});
    return this.usersService.findAll();
  }

  // 유저 생성
  @Post()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard) 
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password, affiliatedInstitutions } = dto;
    // this.printLoggerServiceLog('l',{ dto });
    // this.usersService.saveUserUsingTransaction(name, email, password, signupVerifyToken, affiliatedInstitutions)
    this.usersService.createUser(name, email, password, affiliatedInstitutions[0])
    return ;
  }

  // 유저 회원 가입시 이메일 올바른지 검증
  @Post('email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    return;
  }

  // 유저 로그인 및 토큰 발급
  // access 와 refresh 토큰 발행
  // 해당 url은 refresh 토큰을 마구 발급한다 refresh토큰을 마구 발급해서는 좋지 못하므로 이에 대해서 방어를 하는 로직을 짜자
  // 현재는 단순 저장의 형태가 전부다
  // 시니어 개발자님에게 리프레쉬 토큰 전략에 대해서 여쭤볼것
  
  @Post('/login/:affiliatedInstitution')
  async signIn(
    @Body() dto: UserLoginDto,
    @Param('affiliatedInstitution', ValidationPipe) affiliatedInstitution: string): Promise<string | object> {
    this.printLoggerServiceLog('l',{ dto });
    const { email, password } = dto;
    const username = email;
    // 디테일한 로그인 미구현
    return await this.usersService.login(username, password, affiliatedInstitution );;
  }

  @Post('/relogin/:affiliatedInstitution')
  async signInWithExhiredJwt(
    @Body() dto: TokenLoginDto,
    @Param('affiliatedInstitution', ValidationPipe) affiliatedInstitution: string): Promise<string | object> {
    this.printLoggerServiceLog('l',{ dto });
    const { jwtAccessString, jwtRefreshString  } = dto;
    // 디테일한 로그인 미구현
    return await this.usersService.reLoginWithExhiredJwtAccessStirng(jwtAccessString, jwtRefreshString, affiliatedInstitution );;
  }

}

// export class CreateUserDto {
//   readonly name: string;
//   readonly publishedService: number;
//   readonly email: string;
//   readonly password: string;    
// }

