import { Inject, Injectable } from '@nestjs/common';
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
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RedisStore } from 'cache-manager-redis-store';

@Injectable()
export class RecipesService {
  private redisClient: ReturnType<RedisStore['getClient']>;
  // TODO: move to constants ???
  private singleRecipeCollectionKey = 'recipe';
  private multipleRecipesCollectionKey = 'recipes';
  private expirationInSeconds = 10;

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly fileStorageService: FileStorageService,
    // of course interceptors could be used here
    // but I intentionally wanted to expose underlying implementation (Redis) and use it as is
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    const redisStore = cacheManager.store as unknown as RedisStore;

    this.redisClient = redisStore.getClient();

    this.redisClient.EXPIRE(
      this.singleRecipeCollectionKey,
      this.expirationInSeconds,
    );
  }

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

  async findOne(id: string) {
    const isAlreadyInCache = await this.redisClient.HEXISTS(
      this.singleRecipeCollectionKey,
      id,
    );

    if (isAlreadyInCache) {
      const cachedValue = await this.redisClient.HGET(
        this.singleRecipeCollectionKey,
        id,
      );

      console.info(`Recipe ${id} was read from cache`);

      return JSON.parse(cachedValue);
    }

    const recipe = await this.recipeRepository.find({
      where: { id },
      relations: {
        tags: true,
        chef: true,
      },
    });

    await this.redisClient.HSET(
      this.singleRecipeCollectionKey,
      id,
      JSON.stringify(recipe),
    );

    console.info(`Recipe ${id} was written to cache`);

    return recipe;
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
