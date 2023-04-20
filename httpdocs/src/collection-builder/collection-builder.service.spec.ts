import { Test, TestingModule } from '@nestjs/testing';
import { CollectionBuilderService } from './collection-builder.service';

describe('CollectionBuilderService', () => {
  let service: CollectionBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionBuilderService],
    }).compile();

    service = module.get<CollectionBuilderService>(CollectionBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
