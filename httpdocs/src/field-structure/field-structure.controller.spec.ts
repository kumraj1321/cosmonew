import { Test, TestingModule } from '@nestjs/testing';
import { FieldStructureController } from './field-structure.controller';
import { FieldStructureService } from './field-structure.service';

describe('FieldStructureController', () => {
  let controller: FieldStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldStructureController],
      providers: [FieldStructureService],
    }).compile();

    controller = module.get<FieldStructureController>(FieldStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
