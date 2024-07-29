import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeTagDto } from './create-recipe-tag.dto';

export class UpdateRecipeTagDto extends PartialType(CreateRecipeTagDto) {}
