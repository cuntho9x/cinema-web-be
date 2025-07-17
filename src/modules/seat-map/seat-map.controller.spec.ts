import { Test, TestingModule } from '@nestjs/testing';
import { SeatMapController } from './seat-map.controller';

describe('SeatMapController', () => {
  let controller: SeatMapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatMapController],
    }).compile();

    controller = module.get<SeatMapController>(SeatMapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
