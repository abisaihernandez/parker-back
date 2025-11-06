import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { ConfigModule, ConfigService } from '@nestjs/config';
import schema from './db/schema';
import { DB_TAG } from './db/constants';
import { HealthModule } from './health/health.module';
import { LotsModule } from './lots/lots.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SpotsModule } from './spots/spots.module';
import { AvailabilityForecastModule } from './availability-forecast/availability-forecast.module';

@Module({
  imports: [
    DrizzlePGModule.registerAsync({
      tag: DB_TAG,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pg: {
          connection: 'client',
          config: {
            connectionString: configService.getOrThrow('DB_URL'),
          },
        },
        config: {
          dialect: 'postgresql',
          casing: 'snake_case',
          schema: { ...schema },
        },
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    LotsModule,
    ReservationsModule,
    SpotsModule,
    AvailabilityForecastModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
