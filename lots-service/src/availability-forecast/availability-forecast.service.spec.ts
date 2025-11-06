import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityForecastService } from './availability-forecast.service';

describe('AvailabilityForecastService', () => {
  let service: AvailabilityForecastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailabilityForecastService],
    }).compile();

    service = module.get<AvailabilityForecastService>(AvailabilityForecastService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
