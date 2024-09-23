import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: String,
    description: 'The title of the post',
    required: true,
    example: 'Hello world',
  })
  @IsString()
  title: string;
}
