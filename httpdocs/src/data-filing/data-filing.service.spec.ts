import { Test, TestingModule } from '@nestjs/testing';
import { DataFilingService } from './data-filing.service';

describe('DataFilingService', () => {
  let service: DataFilingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataFilingService],
    }).compile();

    service = module.get<DataFilingService>(DataFilingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
