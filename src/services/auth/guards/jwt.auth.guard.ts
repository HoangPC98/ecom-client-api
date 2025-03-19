import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_API } from 'src/common/constants/index.contant';
import { TOKEN_TYPE } from 'src/common/enums/index.enum';

@Injectable()
export class ClientJwtAuthGuard extends AuthGuard(TOKEN_TYPE.ACCESS_TOKEN) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(PUBLIC_API, context.getHandler());
    if (isPublic) {
      return true;
    }
    const token: string = context.switchToHttp().getRequest().headers['authorization'];
    if (!token) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }
}
