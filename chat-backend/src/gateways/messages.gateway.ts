import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as clc from 'cli-color';
import * as ws from 'ws';
import * as url from 'url';
import { IncomingMessage } from 'http';
import { AuthService } from '../api/auth/auth.service';
import { ISession } from '../common/schemas/session.schema';

const CONNECTION = clc.white('CONNECTION');

interface WsE extends ws {
  number: number;
  resolved: Promise<void>;
  session: ISession;
}

@WebSocketGateway({
  path: '/channel',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private connectionCounter = 0;

  constructor(
    private readonly authService: AuthService,
  ) {
  }

  afterInit(server: ws.Server) {
    const port = server.options.port || '';
    const host = server.options.host || '';
    console.log(`${clc.green('WS')} started on "${host}:${port}/${server.options.path}`);
  }

  async handleConnection(wse: WsE, incomingMessage: IncomingMessage) {
    const urlParsed = url.parse(incomingMessage.url);
    const urlSearchParams = new url.URLSearchParams(urlParsed.query);
    const token = urlSearchParams.get('token');

    wse.onclose = evt => this.handleDisconnect(wse);

    wse.resolved = new Promise((resolve, reject) => {
      this.authService.findSessionByToken(token)
        .then(session => {
          wse.session = session;
          wse.number = this.connectionCounter++;
          console.log(`${CONNECTION} ${clc.green(' open')} #${wse.number} from user "${session.username}" `);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async handleDisconnect(wse: WsE) {
    await wse.resolved;
    console.log(`${CONNECTION} ${clc.red('close')} #${wse.number} from user "${wse.session && wse.session.username}" `);
  }

  @SubscribeMessage('greetings')
  async onGreetings(wse: WsE, data: string): Promise<WsResponse<string>> {
    await wse.resolved;
    return {
      event: 'greetingsResponse',
      data: wse.session.username,
    };
  }
}
