import { IsString, Length, IsDate } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  content: string;

  image: Buffer;

  @IsString()
  @Length(32, 32)
  chef_id: string;
}
