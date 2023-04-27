import { Test, TestingModule } from '@nestjs/testing';
import { HomemanagerService } from './homemanager.service';

describe('HomemanagerService', () => {
  let service: HomemanagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomemanagerService],
    }).compile();

    service = module.get<HomemanagerService>(HomemanagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
