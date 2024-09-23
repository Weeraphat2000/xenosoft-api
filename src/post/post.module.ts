import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Authenticate } from 'src/util/service/authenticate.service';
import { PrismaService } from 'src/util/prisma.service';
import { JwtService } from 'src/util/service/jwt.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    Authenticate,
    PrismaService,
    JwtService,
    UserService,
  ],
})
export class PostModule {}
