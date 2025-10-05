import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  controllers: [],
  providers: [RealtimeGateway]
})
export class RealtimeModule {}
