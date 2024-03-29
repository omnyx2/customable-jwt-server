import {
  Injectable,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from 'src/user.entity';
import { UsersService } from '../users.service';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import emailConfig from 'src/config/emailConfig';
import { Request } from 'express';

interface jwtTokenSet {
  jwtAccessString: string;
  jwtRefreshString: string;
}

// local.strategy -> auth service
@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>, // private usersService: UsersService
  ) {}
  // username인 이유 email, id 이런 것들에 유연한 대응을 위해서 ? 관계 수정 local.strategys

  // 토큰의 유효성 검사만 담당한다
  // 유효가 만료되어도 에러를 일으키지 않으므로 유의해서 사용할 것
  verifyOnly(jwtString: string): User | boolean {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtAccessSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;
      return payload;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  verify(jwtString: string): User {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtAccessSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;
      const { id, email, affiliatedInstitutions } = payload;
      console.log(this.config.jwtAccessSecret);
      return payload;
      //   return {
      //     id: id,
      //     email,
      //     affiliatedInstitutions: affiliatedInstitutions[0]
      //   }
    } catch (e) {
      throw new ForbiddenException();
    }
  }
  verifyRefreshStringOnly(jwtString: string): User {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtRefreshSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;
      const { id, email, affiliatedInstitutions } = payload;
      console.log(this.config.jwtRefreshSecret);
      return payload;
    } catch (e) {
      return null;
      //throw new ForbiddenException();
    }
  }

  login(user: User): jwtTokenSet {
    const {
      password,
      //    accessLevel,
      signupVerifyToken,
      jwtRefreshToken,
      name,
      ...payload
    } = user;

    const jwtAccessString = jwt.sign(payload, this.config.jwtAccessSecret, {
      algorithm: 'HS256',
      expiresIn: '30m',
      audience: 'example.com',
      issuer: 'example.com',
    });
    const jwtRefreshString = jwt.sign(payload, this.config.jwtRefreshSecret, {
      algorithm: 'HS256',
      expiresIn: '180d',
      audience: 'example.com',
      issuer: 'example.com',
    });
    return { jwtAccessString, jwtRefreshString };
  }

  reLogin(user: User): string {
    // const payload = jwt.verify(
    //     jwtString,
    //     this.config.jwtAccessSecret) as
    //     (jwt.JwtPayload | string) & User;
    // const { id, email, affiliatedInstitutions } = payload;
    // return payload
    const {
      password,
      //    accessLevel,
      signupVerifyToken,
      jwtRefreshToken,
      name,
      ...payload
    } = user;

    const jwtAccessString = jwt.sign(payload, this.config.jwtAccessSecret, {
      algorithm: 'HS256',
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });

    return jwtAccessString;
  }
}
