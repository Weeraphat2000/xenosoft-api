import {
  Controller,
  Patch,
  Param,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { LikeService } from './like.service';

import { CustomRequest } from 'src/util/service/authenticate.service';
import { PostService } from 'src/post/post.service';
import { Auth } from 'src/util/service/auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('like')
@ApiTags('Like')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly postService: PostService,
  ) {}

  @Patch(':id')
  @Auth()
  async update(@Param('id') id: string, @Req() req: CustomRequest) {
    const hasPost = await this.postService.findOne(id);
    if (!hasPost) {
      throw new NotFoundException('Post not found');
    }

    const like = await this.likeService.findlikeByUserId(req.user.id);

    if (like) {
      if (like.postId === id) {
        await this.likeService.remove(like.id);
        return {
          message: 'unliked',
          data: await this.postService.findOneA(id, req.user.id),
        };
      }

      throw new NotFoundException(
        'You cannot like this post because you have liked another post',
      );
    }

    const isLike = await this.likeService.findlikeByPostId(id);
    if (isLike) {
      throw new ForbiddenException(
        'You cannot like this post! because it has been liked',
      );
    }
    await this.likeService.create(req.user.id, id);
    return {
      message: 'liked',
      data: await this.postService.findOneA(id, req.user.id),
    };
  }
}
