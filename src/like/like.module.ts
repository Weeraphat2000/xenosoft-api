import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Authenticate } from 'src/util/service/authenticate.service';
import { PrismaService } from 'src/util/prisma.service';
import { JwtService } from 'src/util/service/jwt.service';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Module({
  controllers: [LikeController],
  providers: [
    LikeService,
    Authenticate,
    PrismaService,
    JwtService,
    UserService,
    PostService,
  ],
})
export class LikeModule {}
