import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IncomingMessage } from 'http';

@Injectable()
export class MessagesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getArgByIndex(0) instanceof IncomingMessage) {
      return true;
    }
    return context.getArgs()[0].resolved;
  }
}
