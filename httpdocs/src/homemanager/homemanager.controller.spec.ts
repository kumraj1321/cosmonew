import { Test, TestingModule } from '@nestjs/testing';
import { HomemanagerController } from './homemanager.controller';
import { HomemanagerService } from './homemanager.service';

describe('HomemanagerController', () => {
  let controller: HomemanagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomemanagerController],
      providers: [HomemanagerService],
    }).compile();

    controller = module.get<HomemanagerController>(HomemanagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
