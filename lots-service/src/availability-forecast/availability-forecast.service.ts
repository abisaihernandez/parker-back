import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AvailabilityForecastService {
  private availabilityForecastServiceEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.availabilityForecastServiceEndpoint = `http://${this.configService.getOrThrow('AVAILABILITY_FORECAST_SERVICE_HOST')}:${this.configService.getOrThrow('AVAILABILITY_FORECAST_SERVICE_PORT')}`;
  }

  async getLotAvailabilityForecasts(
    day: number,
    hour: number,
    lotIds: number[],
  ) {
    const result = await firstValueFrom(
      this.httpService.get<
        Record<number, { predictedAvailability: number; confidence: number }>
      >(`${this.availabilityForecastServiceEndpoint}/availability-forecast`, {
        params: { day, hour, lot_ids: lotIds.join(',') },
      }),
    );

    return result.data;
  }
}
