import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/util/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: string, postId: string) {
    return this.prismaService.vote.create({
      data: {
        userId,
        postId,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.vote.findMany({
      where: {
        userId,
      },
    });
  }

  findlikeByUserId(userId: string) {
    return this.prismaService.vote.findFirst({
      where: {
        userId,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.vote.delete({
      where: {
        id,
      },
    });
  }

  findlikeByPostId(postId: string) {
    return this.prismaService.vote.findFirst({
      where: {
        postId,
      },
      include: {
        User: true,
      },
    });
  }
}
