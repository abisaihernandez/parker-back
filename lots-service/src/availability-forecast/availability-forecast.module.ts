import { Module } from '@nestjs/common';
import { AvailabilityForecastService } from './availability-forecast.service';

@Module({
  providers: [AvailabilityForecastService]
})
export class AvailabilityForecastModule {}
