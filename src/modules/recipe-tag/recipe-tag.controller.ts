import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecipeTagService } from './recipe-tag.service';
import { CreateRecipeTagDto } from './dto/create-recipe-tag.dto';
import { UpdateRecipeTagDto } from './dto/update-recipe-tag.dto';

@Controller('recipe-tags')
export class RecipeTagController {
  constructor(private readonly recipeTagService: RecipeTagService) {}

  @Post()
  create(@Body() createRecipeTagDto: CreateRecipeTagDto) {
    return this.recipeTagService.create(createRecipeTagDto);
  }

  @Get()
  findAll() {
    return this.recipeTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeTagService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipeTagDto: UpdateRecipeTagDto,
  ) {
    return this.recipeTagService.update(id, updateRecipeTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeTagService.remove(id);
  }
}
