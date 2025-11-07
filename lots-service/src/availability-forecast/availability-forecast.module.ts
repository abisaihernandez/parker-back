import { Module } from '@nestjs/common';
import { AvailabilityForecastService } from './availability-forecast.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AvailabilityForecastService],
  exports: [AvailabilityForecastService],
})
export class AvailabilityForecastModule {}
