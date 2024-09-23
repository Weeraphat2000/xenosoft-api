import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { HashService } from 'src/util/service/hash.service';
import { JwtService } from 'src/util/service/jwt.service';
import { CustomRequest } from 'src/util/service/authenticate.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/util/service/auth.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const isDuplicate = await this.userService.findUserByUsername(
      createUserDto.username,
    );
    if (isDuplicate) {
      throw new NotFoundException('Username already exists');
    }
    const newData = {
      username: createUserDto.username,
      password: await this.hashService.hashPassword(createUserDto.password),
    };

    const user = await this.userService.create(newData);

    delete user.password;

    return {
      user,
      token: this.jwtService.sign({ username: user.id }),
    };
  }

  @Post('login')
  async login(@Body() createUserDto: LoginUserDto) {
    const user = await this.userService.findUserByUsername(
      createUserDto.username,
    );
    if (!user) {
      throw new UnauthorizedException('password or username is incorrect');
    }

    const isValid = await this.hashService.comparePassword(
      createUserDto.password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('password or username is incorrect');
    }

    delete user.password;

    return {
      user,
      token: this.jwtService.sign({ username: user.id }),
    };
  }

  @Get('me')
  @Auth()
  findMe(@Req() req: CustomRequest) {
    return req.user;
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.userService.findUserByUsername(id);
  }
}
