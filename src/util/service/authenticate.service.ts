import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from './jwt.service';
import { UserService } from 'src/user/user.service';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

@Injectable()
export class Authenticate implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findUesrById(payload.username);

      req.user = user;
      next();
    } catch (error) {
      throw new NotFoundException('token is wrong');
    }
  }
}
