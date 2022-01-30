import { ConsoleLogger, Injectable, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User } from './user.entity';
import { UserInfo } from './UserInfo';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { ulid } from 'ulid';
import { AuthService } from './auth/auth.service';
import * as moment from 'moment-timezone'
// email은 유저의 행동과 관련있는서 요청 탐색 조건
// id는 서버와 서버간 탐색 수단 또는 유저측 자동화의 경우

interface jwtTokenSet {
  jwtAccessString: string;
  jwtRefreshString: string;
}

@Injectable() 
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
    private connection: Connection,
    private emailService: EmailService
  ) {}

  async createUser(name: string, email: string, password: string, affiliatedInstitution: string): Promise<void> {
    const user: User = await this.usersRepository.findOne({email});
    const signupVerifyToken: string = uuid.v1();
    //    await this.saveUserUsingTransaction(name, email, password, signupVerifyToken, affiliatedInstitutions);
      
    if ( user === undefined ) {
      await this.saveUserUsingTransaction(name, email, password, signupVerifyToken, affiliatedInstitution); 
    } else {
      if ( user.affiliatedInstitutions.includes(affiliatedInstitution) ) { 
        throw new UnprocessableEntityException('이미 가입되어 있습니다. 수 없습니다.');
      } else {      
        await this.saveUserServiceUsingTransaction( email, affiliatedInstitution); 
      }
    }
    // 로그인 승인 토큰 전달
  
    // 회원 가입 인증 이메일 발송, 시스템 회원 가입이면 무시
    // await this.sendMemberJoinEmail(email, signupVerifyToken);
    // return ;
  }

  // private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
  //   await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  // }
  // 이 서비스를 이용하는 경우는 이미 토큰을 통해 올바른 사용자임을 검증하고 넘어간다.
  // 하지만 그래도 이중 체크
  async getUserInfoById(id: string, affiliatedInstitution: string): Promise<User> {

    const user = await this.usersRepository.findOne({ id: id });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    const checkUserInService = await this.checkUserInService(user, affiliatedInstitution)
    if( user && !checkUserInService ){
      throw new NotFoundException('잘못된 서비스 입니다.');
    }
      
    return user;
  }

  private async checkUserExistsByEmail(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddress });
    return user !== undefined;
  }

  private async checkUserExistsById(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ id: username });
    return user !== undefined;
  }


  private async checkUserInServiceByEmail(username: string, affiliatedInstitution: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: username });
    console.log(user)
    return user.affiliatedInstitutions.includes(affiliatedInstitution);
  }

  private async checkUserInService(user: User, affiliatedInstitution: string): Promise<boolean> {
    const userExist: boolean = user.affiliatedInstitutions.includes(affiliatedInstitution);

    return userExist;
  }

  // 어드민 가입 방식은 아니다. 어드민은 직접 넣어줄 것
  // private async saveUser(name: string, email: string, password: string, signupVerifyToken: string, affiliatedInstitutions: string[]) {
  // private async saveAdmin(name: string, email: string, password: string, signupVerifyToken: string, affiliatedInstitutions: string[]) {
  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string, affiliatedInstitutions: string[]) {
    
    const user = new User();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.accessLevel = 3;
    user.signupVerifyToken = signupVerifyToken;
    user.affiliatedInstitutions = affiliatedInstitutions;

    await this.usersRepository.save(user);

    return; // TODO: DB 연동 후 구현
  }

  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string, affiliatedInstitutions: string[]) {
    const queryRunner = this.connection.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const user = new User();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
  
      await queryRunner.manager.save(user);
  
      // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다s
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string, email: string, password: string, signupVerifyToken: string, affiliatedInstitution: string) {
    await this.connection.transaction(async manager => {
      const user = new User();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.accessLevel = 3;
      user.signupVerifyToken = signupVerifyToken;
      user.affiliatedInstitutions = [affiliatedInstitution];
    
      // user.signupVerifyToken = signupVerifyToken;
  
      await manager.save(user);
  
      // throw new InternalServerErrorException();
    })
  }

  // 이미 가입한 회원의 서비스를 늘려주는 방법
  // 가입 서비스 자체가 증가하는 로직
  private async saveUserServiceUsingTransaction (
    email: string, affiliatedInstitution: string) {
      await this.connection.transaction(async manager => {
        const user: User = await manager.findOne(User, {email})
        console.log(user.affiliatedInstitutions)
        user.affiliatedInstitutions.push(affiliatedInstitution);
      
        await manager.save(user); 
      })
    }
  
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
    // return ;
  }

  private async findByIdOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  private async findByEmailOne(email: string): Promise<User> {
    const result: User = await this.usersRepository.findOne({ email });
    return result;
  }

  async login(email: string, password: string, affiliatedInstitution: string): Promise<string | object> {
    const user: User= await this.usersRepository.findOne({ email, password });    
    if (user === undefined){
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    const userExistService: boolean = await this.checkUserInService(user, affiliatedInstitution);
    if (!userExistService) {
      throw new NotFoundException('유저가 서비스에 가입하지 않았습니다');
    }
    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      lastActivate: await this.saveUserLastActivate(user),
      affiliatedInstitutions: [affiliatedInstitution],
      password: '',
      accessLevel: 0,
      signupVerifyToken: '',
      jwtRefreshToken: ''
    }

    let payload: jwtTokenSet = await this.authService.login(userData);
    // 리프레쉬 토큰이 유효할 경우 불러와서 다시 보내준다
    // 이부분의 존재 의의는 리프레쉬 토큰을 단일화 하기 위함이다.
    if( !!!user.jwtRefreshToken ) {
      user.jwtRefreshToken = payload.jwtRefreshString; 
    } else {
      const checkJwtRefreshString = await this.authService.verifyOnly(user.jwtRefreshToken);
      if( !!checkJwtRefreshString ) {
        payload.jwtRefreshString = user.jwtRefreshToken;
      } else {
        user.jwtRefreshToken = payload.jwtRefreshString; 
      }
    }

    user.lastActivate = moment().tz("Asia/Seoul").format();
    await this.usersRepository.save(user);

    return payload
  }
  // 사용전에 Refresh토큰이 다시 만료되기 위한 조건
  // access토큰이 만료되었지만 정당하다.
  // Refresh토큰은 만료되었지 않다.
  // Refresh토큰이 동일하지 못할 수 있다.
  async reLoginWithExhiredJwtAccessStirng(
    jwtAccessString: string, 
    jwtRefreshString: string, 
    affiliatedInstitution: string): Promise<string|object> {
    const checkJwtRefreshString = await this.authService.verify(jwtRefreshString)
    const user: User= await this.usersRepository.findOne({ id: checkJwtRefreshString.id});
      
    if (user === undefined) {
      throw new UnprocessableEntityException('리프레쉬 토큰이 존재하지 않습니다. 다시 로그인 해줘야 합니다');
    }

    const payload: string = this.authService.reLogin({
      id: user.id,
      name: user.name,
      email: user.email,
      lastActivate: await this.saveUserLastActivate(user),
      affiliatedInstitutions: user.affiliatedInstitutions,
      password: '',
      accessLevel: 0,
      signupVerifyToken: '',
      jwtRefreshToken: ''
    });
    return { jwtAcessString: payload, jwtRefreshString: jwtRefreshString}
  }

  private async saveUserLastActivate(user: User) {
    const lastActivate: string = moment().tz("Asia/Seoul").format();
    user.lastActivate = lastActivate
    await this.usersRepository.save(user);
    return lastActivate
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string | object> {
    const user = await this.usersRepository.findOne({ signupVerifyToken });
  
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      accessLevel: 0,
      lastActivate: undefined,
      signupVerifyToken: '',
      affiliatedInstitutions: [],
      jwtRefreshToken: ''
    });
  }
}

