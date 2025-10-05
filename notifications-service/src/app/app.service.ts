import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RealtimeUpdateType } from 'src/constants/realtime-update-type';
import { APP_SERVICE } from 'src/constants/services';

@Injectable()
export class AppService {
  constructor(
    @Inject(APP_SERVICE) private readonly appServiceClient: ClientProxy,
  ) {}

  async sendRealtimeUpdate(updateType: RealtimeUpdateType, payload: unknown) {
    return await firstValueFrom(
      this.appServiceClient.send('realtime_update', { updateType, payload }),
    );
  }
}
