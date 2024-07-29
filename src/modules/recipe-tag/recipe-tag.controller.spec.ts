import { Test, TestingModule } from '@nestjs/testing';
import { RecipeTagController } from './recipe-tag.controller';
import { RecipeTagService } from './recipe-tag.service';

describe('RecipeTagController', () => {
  let controller: RecipeTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeTagController],
      providers: [RecipeTagService],
    }).compile();

    controller = module.get<RecipeTagController>(RecipeTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
