import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0, { message: 'Skip value must be a positive integer.' })
  skip? = 0;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1, { message: 'Take value must be at least 1.' })
  @Max(50, { message: 'Take value cannot exceed 50.' })
  take? = 10;
}
