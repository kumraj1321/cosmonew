import { Test, TestingModule } from '@nestjs/testing';
import { CollectionBuilderController } from './collection-builder.controller';
import { CollectionBuilderService } from './collection-builder.service';

describe('CollectionBuilderController', () => {
  let controller: CollectionBuilderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionBuilderController],
      providers: [CollectionBuilderService],
    }).compile();

    controller = module.get<CollectionBuilderController>(CollectionBuilderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
