import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { JwtGuard } from 'src/guards/jwt.guard';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, JwtGuard],
  imports: [TypeOrmModule.forFeature([Recipe]), FileStorageModule],
})
export class RecipesModule {}
