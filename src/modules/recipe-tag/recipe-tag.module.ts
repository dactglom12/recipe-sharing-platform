import { Module } from '@nestjs/common';
import { RecipeTagService } from './recipe-tag.service';
import { RecipeTagController } from './recipe-tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeTag } from './entities/recipe-tag.entity';

@Module({
  controllers: [RecipeTagController],
  providers: [RecipeTagService],
  imports: [TypeOrmModule.forFeature([RecipeTag])],
})
export class RecipeTagModule {}
