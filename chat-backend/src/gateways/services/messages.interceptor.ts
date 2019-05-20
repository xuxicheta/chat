import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as clc from 'cli-color';
import { WsE } from '../messages.gateway';
import { IncomingMessage } from 'http';

const logSocket = process.env.LOG_SOCKET ? console.log : (...v) => undefined;

@Injectable()
export class MessagesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getArgs()[0] instanceof IncomingMessage) {
      return next.handle();
    }
    const event = context.getHandler().name;
    const data = context.getArgs()[1];
    const wse: WsE = context.getArgs()[0];
    logSocket(`${clc.bgRed('in')} ${wse.session.username} ${JSON.stringify({ event, data })}`);
    return next.handle().pipe(tap((answer) => {
      logSocket(`${clc.bgBlue('out')} ${wse.session.username} ${JSON.stringify(answer)}`);
    }));
  }
}
