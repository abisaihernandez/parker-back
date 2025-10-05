import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'realtime',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class RealtimeGateway implements OnGatewayInit {
  afterInit(server: Server) {
    console.log('Gateway initialized');
    server.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Log connection errors
    server.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Received message:', payload);
    return 'Hello world!';
  }
}
