import { Injectable } from '@nestjs/common';
import { CreateRecipeTagDto } from './dto/create-recipe-tag.dto';
import { UpdateRecipeTagDto } from './dto/update-recipe-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeTag } from './entities/recipe-tag.entity';
import { Repository } from 'typeorm';
import { Recipe } from '../recipes/entities/recipe.entity';

@Injectable()
export class RecipeTagService {
  constructor(
    @InjectRepository(RecipeTag)
    private readonly recipeTagRepository: Repository<RecipeTag>,
  ) {}

  create(createRecipeTagDto: CreateRecipeTagDto) {
    const recipeTag = new RecipeTag();

    recipeTag.label = createRecipeTagDto.label;
    recipeTag.recipe = { id: createRecipeTagDto.recipe_id } as Recipe;

    return this.recipeTagRepository.save(recipeTag);
  }

  findAll() {
    return this.recipeTagRepository.find();
  }

  findOne(id: string) {
    return this.recipeTagRepository.findOne({ where: { id } });
  }

  update(id: string, updateRecipeTagDto: UpdateRecipeTagDto) {
    return this.recipeTagRepository.update({ id }, updateRecipeTagDto);
  }

  remove(id: string) {
    return this.recipeTagRepository.delete({ id });
  }
}
