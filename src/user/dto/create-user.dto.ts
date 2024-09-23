import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MatchPasswords } from 'src/decorator/math-password.decorator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The username of the user',
    required: true,
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
    required: true,
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    description: 'The confirm password of the user',
    required: true,
    example: 'password',
  })
  @IsString()
  @MatchPasswords('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}

export class LoginUserDto {
  @ApiProperty({
    type: String,
    description: 'The username of the user',
    required: true,
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
    required: true,
    example: 'password',
  })
  @IsString()
  password: string;
}
