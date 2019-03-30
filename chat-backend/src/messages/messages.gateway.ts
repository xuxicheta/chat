import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';


@WebSocketGateway({
  path: '/channel',
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('after init');
  }

  handleConnection(socket: import('ws')) {
    console.log('connection', socket);
    socket.send('12345');
  }

  @SubscribeMessage('events')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    console.log(client);
    console.log(data);
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
