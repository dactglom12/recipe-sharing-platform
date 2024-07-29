import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Chef } from '../chefs/entities/chef.entity';
import {
  PaginatedResponse,
  PaginationParams,
} from '../common/types/pagination.type';
import { FilterRecipesQueryParams } from './recipes.types';
import { FileStorageService } from '../file-storage/file-storage.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, imageFile: Buffer) {
    const recipe = new Recipe();

    recipe.content = createRecipeDto.content;
    recipe.chef = { id: createRecipeDto.chef_id } as Chef;
    recipe.tags = [];

    const savedRecipe = await this.recipeRepository.save(recipe);

    await this.fileStorageService.upload(
      `/recipes/${savedRecipe.id}`,
      imageFile,
    );

    return savedRecipe;
  }

  async findAll(
    query: PaginationParams & FilterRecipesQueryParams,
  ): Promise<PaginatedResponse<Recipe[]>> {
    const [result, count] = await this.filter(query);

    return { count, data: result };
  }

  findOne(id: string) {
    return this.recipeRepository.find({
      where: { id },
      relations: {
        tags: true,
        chef: true,
      },
    });
  }

  update(id: string, updateRecipeDto: UpdateRecipeDto) {
    return this.recipeRepository.update({ id }, updateRecipeDto);
  }

  remove(id: string) {
    return this.recipeRepository.delete(`DELETE FROM recipe WHERE id = ${id}`);
  }

  private filter(query: PaginationParams & FilterRecipesQueryParams) {
    const builder = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.tags', 'tag')
      .leftJoinAndSelect('recipe.chef', 'chef')
      .take(query.take ?? 10)
      .skip(query.skip ?? 0);

    const filteredCriteria = Object.entries(query).reduce((acc, curr) => {
      const [key, value] = curr;

      if (!value) return acc;

      acc[key] = value;

      return acc;
    }, {} as FilterRecipesQueryParams);

    const entries = Object.entries(filteredCriteria);

    if (entries.length === 0) return builder.getManyAndCount();

    const [firstCriteria, ...otherCriterias] = entries;

    this.buildCriteria(
      builder,
      firstCriteria[0] as keyof FilterRecipesQueryParams,
      firstCriteria[1],
      true,
    );

    otherCriterias.forEach((criteria) => {
      this.buildCriteria(
        builder,
        criteria[0] as keyof FilterRecipesQueryParams,
        criteria[1],
        false,
      );
    });

    return builder.getManyAndCount();
  }

  private buildCriteria(
    builder: SelectQueryBuilder<Recipe>,
    key: keyof FilterRecipesQueryParams,
    value: string | string[] | Date,
    isFirst: boolean,
  ) {
    const method = isFirst ? 'where' : 'andWhere';

    if (key === 'keywords') {
      builder[method](`recipe.content LIKE :keywords`, {
        keywords: `%${value}%`,
      });
    }
    if (key === 'chef_id') {
      builder[method](`recipe.chefId = :chef_id`, { chef_id: value });
    }
    if (key === 'publication_date') {
      builder[method](
        `recipe.created_at BETWEEN :date AND :date + INTERVAL '1 day'`,
        { date: new Date(value as string) },
      );
    }
    if (key === 'tags' && Array.isArray(value)) {
      builder[method]('tag.label IN (:...labels)', { labels: value });
    }

    return builder;
  }
}
