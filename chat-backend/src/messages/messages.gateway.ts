import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway({
  path: 'messages',
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('')

  @SubscribeMessage('events')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    console.log(client);
    console.log(data);
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
