import { Module } from '@nestjs/common';
import { RecipesModule } from './modules/recipes/recipes.module';
import { ChefsModule } from './modules/chefs/chefs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RecipeTagModule } from './modules/recipe-tag/recipe-tag.module';
import typeorm from './config/typeorm';
import { config } from './config/index';
import { AuthModule } from './modules/auth/auth.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config, typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log(configService);
        return configService.get('typeorm');
      },
    }),
    RecipesModule,
    ChefsModule,
    RecipeTagModule,
    AuthModule,
    FileStorageModule,
  ],
})
export class AppModule {}
