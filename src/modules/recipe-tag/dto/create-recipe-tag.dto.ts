import { IsString, Length } from 'class-validator';

export class CreateRecipeTagDto {
  @IsString()
  label: string;

  @IsString()
  @Length(32, 32)
  recipe_id: string;
}
