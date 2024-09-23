import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CustomRequest } from 'src/util/service/authenticate.service';
import { ApiTags } from '@nestjs/swagger';
import { QueryParamsDto } from './dto/quryParams.dto';
import { Auth } from 'src/util/service/auth.service';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: CustomRequest,
  ) {
    const result = await this.postService.create({
      title: createPostDto.title,
      userId: req.user.id,
    });
    return this.postService.findOneA(result.id, req.user.id);
  }

  @Get()
  @Auth()
  async findAll(
    @Req() req: CustomRequest,
    @Query()
    query: QueryParamsDto,
  ) {
    try {
      const [column, value] = query.orderBy
        ? query.orderBy.split(':')
        : ['', ''];

      if (
        column !== 'title' &&
        column !== 'username' &&
        column !== 'updatedAt' &&
        column !== 'createdAt' &&
        column !== ''
      ) {
        throw new NotFoundException('Column not found');
      }

      const result = await this.postService.find(
        {
          search: query.search,
          column: column,
          orderBy: value,
        },
        req.user.id,
      );
      if (query.select === 'like') {
        return result.filter((post) => post._count.Vote > 0);
      }
      if (query.select === 'me') {
        return result.filter((post) => post.User.id === req.user.id);
      }

      return result;
    } catch (err) {
      throw new NotFoundException(err?.response?.message || 'Error');
    }
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.postService.findOneWithUser(id, req.user.id);
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return result;
  }

  @Patch(':id')
  @Auth()
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: CustomRequest,
  ) {
    const post = await this.postService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.Vote.length > 0) {
      throw new ForbiddenException(
        'You cannot update this post because it has been liked',
      );
    }

    if (post.userId !== req.user.id) {
      throw new ForbiddenException(
        'You cannot update this post because it is not yours',
      );
    }
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string, @Req() req: CustomRequest) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== req.user.id) {
      throw new ForbiddenException(
        'You cannot delete this post because it is not yours',
      );
    }

    if (post.Vote.length > 0) {
      throw new ForbiddenException(
        'You cannot delete this post because it has been liked',
      );
    }

    return this.postService.remove(id);
  }
}
