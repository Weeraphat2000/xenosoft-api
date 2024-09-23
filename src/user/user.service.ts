import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/util/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createUserDto: { username: string; password: string }) {
    return this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
      },
    });
  }

  findUserByUsername(username: string) {
    return this.prismaService.user.findFirst({
      where: { username },
    });
  }

  async findUesrById(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });
    if (!user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  findAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        isVote: true,
      },
    });
  }
}
