import { Test, TestingModule } from '@nestjs/testing';
import { RecipeTagService } from './recipe-tag.service';

describe('RecipeTagService', () => {
  let service: RecipeTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeTagService],
    }).compile();

    service = module.get<RecipeTagService>(RecipeTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
