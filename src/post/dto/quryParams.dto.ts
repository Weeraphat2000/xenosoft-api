import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The search string (title, username)',
    example: 'john',
  })
  search?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Order by the column username or like or updatedAt or title',
    example: 'name:asc',
  })
  orderBy?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Filter by the column isLike',
    example: 'true',
  })
  select?: string;
}
