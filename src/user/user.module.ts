import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/util/prisma.service';
import { HashService } from 'src/util/service/hash.service';
import { JwtService } from 'src/util/service/jwt.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, HashService, JwtService],
})
export class UserModule {}
