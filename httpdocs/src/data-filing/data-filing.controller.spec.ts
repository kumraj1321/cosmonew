import { Test, TestingModule } from '@nestjs/testing';
import { DataFilingController } from './data-filing.controller';
import { DataFilingService } from './data-filing.service';

describe('DataFilingController', () => {
  let controller: DataFilingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataFilingController],
      providers: [DataFilingService],
    }).compile();

    controller = module.get<DataFilingController>(DataFilingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
