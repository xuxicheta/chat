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
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/messageDto.class';
import { IMessageModel } from 'src/common/schemas/message.schema';

const CONNECTION = clc.white('CONNECTION');

export enum DOWN_EVENTS {
  GREETINGS_RESPONSE = 'greetingsResponse',
  SEND_MESSAGE_RESPONSE = 'sendMessageResponse',
  RECEIVE_MESSAGE = 'receiveMessage',
}

export enum UP_EVENTS {
  GREETINGS = 'greetings',
  SEND_MESSAGE = 'sendMessage',
  LAST_MESSAGES = 'lastMessages',
}

interface WsE extends ws {
  number: number;
  resolved: Promise<void>;
  session: ISession;
}

interface LimitedWsResponse<T> extends WsResponse<T> {
  event: DOWN_EVENTS;
}

@WebSocketGateway({
  path: '/channel',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private clientsMap = new Map<string, WsE>();
  private connectionCounter = 0;

  constructor(
    private readonly authService: AuthService,
    private readonly messagesService: MessagesService,
  ) {
  }

  afterInit(server: ws.Server) {
    const port = server.options.port || '';
    const host = server.options.host || '';
    console.log(`${clc.green('WS')} started on "${host}:${port}${server.options.path}"`);
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
          this.clientsMap.set(session.userId, wse);
          console.log(`${CONNECTION} ${clc.green(' open')} #${wse.number} from user "${session.username}" `);
          resolve();
          wse.on('message', (message) => {
            console.log(`${clc.bgRed('in')} ${clc.white(wse.session.userId)} ${message}`);
          });
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

  send(wse: WsE, event: DOWN_EVENTS, rawData: any) {
    try {
      const data = typeof rawData === 'string'
        ? rawData
        : JSON.stringify(rawData);
      console.log(`${clc.bgBlue('out')} ${clc.white(wse.session.userId)} ${data}`);
      wse.send({
        event,
        data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage(UP_EVENTS.GREETINGS)
  async onGreetings(wse: WsE, data: string): Promise<LimitedWsResponse<string>> {
    await wse.resolved;
    return {
      event: DOWN_EVENTS.GREETINGS_RESPONSE,
      data: wse.session.username,
    };
  }

  @SubscribeMessage(UP_EVENTS.SEND_MESSAGE)
  async onMessage(wse: WsE, messageDto: MessageDto): Promise<LimitedWsResponse<Date>> {
    await wse.resolved;
    await this.messagesService.saveMessage(messageDto);
    if (messageDto.from !== messageDto.to && this.clientsMap.has(messageDto.to)) {
      this.send(
        this.clientsMap.get(messageDto.to),
        DOWN_EVENTS.RECEIVE_MESSAGE,
        messageDto,
      );
    }
    return {
      event: DOWN_EVENTS.SEND_MESSAGE_RESPONSE,
      data: messageDto.createdAt,
    };
  }

  @SubscribeMessage(UP_EVENTS.LAST_MESSAGES)
  async onLastMessages(wse: WsE, contactId: string): Promise<LimitedWsResponse<IMessageModel[]>> {
    await wse.resolved;
    const lastMessages = await this.messagesService.getLastMessages(contactId, wse.session.userId);
    return {
      event: DOWN_EVENTS.GREETINGS_RESPONSE,
      data: lastMessages,
    };
  }
}
