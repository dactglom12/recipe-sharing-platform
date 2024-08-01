import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/guards/jwt.guard';

const DEFAULT_POPULAR_QUANTITY = 10;

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  findAll(@Query() query: Record<string, string | undefined>) {
    return this.recipesService.findAll({
      skip: query.page ? Number(+query.page * +(query.take ?? 0)) : undefined,
      take: query.take ? Number(query.take) : undefined,
      chef_id: query.chef_id,
      keywords: query.keywords,
      publication_date: query.publication_date,
      tags: query.tags ? query.tags.split(',') : undefined,
    });
  }

  @Get('/popular')
  getPopular(@Query() query: Record<string, string>) {
    return this.recipesService.getNPopular(
      query.popular ? Number(query.popular) : DEFAULT_POPULAR_QUANTITY,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFile()
    imageFile: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    return this.recipesService.create(createRecipeDto, imageFile.buffer);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
