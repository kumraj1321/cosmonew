import { Test, TestingModule } from '@nestjs/testing';
import { FieldStructureService } from './field-structure.service';

describe('FieldStructureService', () => {
  let service: FieldStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldStructureService],
    }).compile();

    service = module.get<FieldStructureService>(FieldStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
