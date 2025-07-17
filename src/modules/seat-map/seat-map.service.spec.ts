import { Test, TestingModule } from '@nestjs/testing';
import { SeatMapService } from './seat-map.service';

describe('SeatMapService', () => {
  let service: SeatMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatMapService],
    }).compile();

    service = module.get<SeatMapService>(SeatMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
