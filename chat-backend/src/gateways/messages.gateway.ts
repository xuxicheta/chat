import { UseGuards, UseInterceptors } from '@nestjs/common';
import * as websockets from '@nestjs/websockets';
import * as clc from 'cli-color';
import { IncomingMessage } from 'http';
import { IMessageModel } from 'src/common/schemas/message.schema';
import * as url from 'url';
import * as ws from 'ws';
import { Server } from 'ws';
import { AuthService } from '../api/auth/auth.service';
import { ISession } from '../common/schemas/session.schema';
import { MessageDto } from './dto/messageDto.class';
import { MessagesGuard } from './messages.guard';
import { MessagesInterceptor } from './messages.interceptor';
import { MessagesService } from './messages.service';

const CONNECTION = clc.white('CONNECTION');
const logSocket = process.env.LOG_SOCKET ? console.log : (...v) => undefined;

export enum DOWN_EVENTS {
  GREETINGS_RESPONSE = 'greetingsResponse',
  SEND_MESSAGE_RESPONSE = 'sendMessageResponse',
  LAST_MESSAGES_RESPONSE = 'lastMessagesResponse',
  RECEIVE_MESSAGE = 'receiveMessage',
}

export enum UP_EVENTS {
  GREETINGS = 'greetings',
  SEND_MESSAGE = 'sendMessage',
  LAST_MESSAGES = 'lastMessages',
}

export interface WsE extends ws {
  number: number;
  resolved: Promise<boolean>;
  session: ISession;
}

interface LimitedWsResponse<T> extends websockets.WsResponse<T> {
  event: DOWN_EVENTS;
}

@UseInterceptors(new MessagesInterceptor())
@UseGuards(new MessagesGuard())
@websockets.WebSocketGateway({
  path: '/channel',

})
export class MessagesGateway implements websockets.OnGatewayConnection, websockets.OnGatewayInit, websockets.OnGatewayDisconnect {
  @websockets.WebSocketServer()
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
          if (!session) {
            throw new Error('session not found');
          }
          wse.session = session;
          wse.number = this.connectionCounter++;
          this.clientsMap.set(session.userId, wse);
          console.log(`${CONNECTION} ${clc.green(' open')} #${wse.number} from user "${session.username}" `);
          resolve(true);
        })
        .catch((error) => {
          console.error(error);
          reject(false);
        });
    });
  }

  async handleDisconnect(wse: WsE) {
    console.log(`${CONNECTION} ${clc.red('close')} #${wse.number} from user "${wse.session && wse.session.username}" `);
  }

  send(wse: WsE, event: DOWN_EVENTS, data: any) {
    try {
      const message = JSON.stringify({
        event,
        data,
      });
      logSocket(`${clc.bgBlue('out')} ${wse.session.username} ${message}`);
      wse.send(message);
    } catch (error) {
      console.error(error);
    }
  }

  @websockets.SubscribeMessage(UP_EVENTS.GREETINGS)
  async greetings(wse: WsE, data: string): Promise<LimitedWsResponse<string>> {
    return {
      event: DOWN_EVENTS.GREETINGS_RESPONSE,
      data: wse.session.username,
    };
  }

  @websockets.SubscribeMessage(UP_EVENTS.SEND_MESSAGE)
  async sendMessage(wse: WsE, messageDto: MessageDto): Promise<LimitedWsResponse<Date>> {
    await this.messagesService.saveMessage(messageDto);
    if (messageDto.from !== messageDto.to && this.clientsMap.has(messageDto.to)) {
      this.send(
        this.clientsMap.get(messageDto.to),
        DOWN_EVENTS.RECEIVE_MESSAGE,
        messageDto,
      );
      console.log(`${clc.bgBlue('out')} ${wse.session.username} ${JSON.stringify({
        event: DOWN_EVENTS.RECEIVE_MESSAGE,
        data: messageDto,
      })}`);
    }
    return {
      event: DOWN_EVENTS.SEND_MESSAGE_RESPONSE,
      data: messageDto.createdAt,
    };
  }

  @websockets.SubscribeMessage(UP_EVENTS.LAST_MESSAGES)
  async lastMessages(wse: WsE, contactId: string): Promise<LimitedWsResponse<IMessageModel[]>> {
    const lastMessages = await this.messagesService.getLastMessages(contactId, wse.session.userId);
    return {
      event: DOWN_EVENTS.LAST_MESSAGES_RESPONSE,
      data: lastMessages,
    };
  }
}
