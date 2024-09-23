import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { JwtService } from './jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Authorization token not found!!');
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findUesrById(payload.username);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      request['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null | undefined {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      return null;
    }
    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
