import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = this.verifyRequest(request);
    // this.attachRolesAtRequest(request, payload);
    request.user = payload;

    return true;
  }

  private verifyRequest(request: Request): User {
    const jwtString = request.headers.authorization?.split('Bearer ')[1];
    console.log(jwtString);
    const payload = this.authService.verify(jwtString);
    return payload;
  }

  private attachRolesAtRequest(request: Request, payload: User) {
    request.user = payload;
    return payload;
  }
}
