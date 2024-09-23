import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/util/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  create(data: { title: string; userId: string }) {
    return this.prismaService.post.create({
      data: {
        title: data.title,
        userId: data.userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.post.findMany({
      include: {
        Vote: { where: { userId } },
        _count: {
          select: { Vote: true },
        },
        User: {
          select: {
            id: true,
            username: true,
            isVote: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.post.findFirst({
      where: {
        id,
      },
      include: {
        Vote: true,
      },
    });
  }

  findOneA(id: string, userId: string) {
    return this.prismaService.post.findFirst({
      where: {
        id,
      },
      include: {
        Vote: { where: { userId } },
        _count: {
          select: { Vote: true },
        },
        User: {
          select: {
            id: true,
            username: true,
            isVote: true,
          },
        },
      },
    });
  }

  findOneWithUser(id: string, userId: string) {
    return this.prismaService.post.findFirst({
      where: {
        id,
      },
      include: {
        Vote: { where: { userId } },
        _count: {
          select: { Vote: true },
        },
        User: {
          select: {
            id: true,
            username: true,
            isVote: true,
          },
        },
      },
    });
  }

  update(id: string, update: UpdatePostDto) {
    return this.prismaService.post.update({
      where: {
        id,
      },
      data: {
        title: update.title,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }

  find(
    {
      search,
      orderBy,
      column,
    }: { search?: string; orderBy?: string; column?: string },
    userId: string,
  ) {
    const o: any = {};

    if (column === 'username') {
      o.User = {
        username: orderBy,
      };
    } else if (column) {
      o[column] = orderBy;
    }

    return this.prismaService.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search || '',
            },
          },
          {
            User: {
              username: {
                contains: search || '',
              },
            },
          },
        ],
      },
      orderBy: Object.keys(o).length > 0 ? o : undefined,
      include: {
        Vote: { where: { userId } },
        _count: {
          select: { Vote: true },
        },
        User: {
          select: {
            id: true,
            username: true,
            isVote: true,
          },
        },
      },
    });
  }
}
