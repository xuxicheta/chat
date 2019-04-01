import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { delay, take, filter } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private socket: WebSocket;
  private token: string;
  private close$ = new Subject<CloseEvent>();
  private open$ = new Subject<Event>();
  private error$ = new Subject<Event>();
  private message$ = new Subject<MessageEvent>();
  private downMessage$$ = new Subject();
  private socketResolved$$ = new BehaviorSubject(false);
  private sentMessageReceipt$$ = new Subject();

  get downMessage$() {
    return this.downMessage$$.asObservable();
  }

  get sentMessageReceipt$() {
    return this.sentMessageReceipt$$.asObservable();
  }


  constructor(
  ) {
    this.listening();
  }

  connect(token) {
    this.token = token;
    this.socket = new WebSocket(`ws://${location.hostname}:${location.port}/channel?token=${token}`);
    this.socket.onopen = evt => this.open$.next(evt);
    this.socket.onerror = evt => this.error$.next(evt);
    this.socket.onclose = evt => this.close$.next(evt);
    this.socket.onmessage = evt => this.message$.next(evt);
  }

  disconnect() {
    this.token = null;
    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.socket.close();
    }
  }

  listening() {
    this.open$.subscribe(evt => {
      this.send(UP_EVENTS.GREETINGS, 'hello');
    });

    this.close$.pipe(delay(2000)).subscribe((evt) => {
      this.socketResolved$$.next(false);
      if (this.token) {
        this.connect(this.token);
      }
    });

    this.message$.subscribe((evt) => {
      const parsedMessage = JSON.parse(evt.data);
      switch (parsedMessage.event) {
        case DOWN_EVENTS.GREETINGS_RESPONSE:
          this.socketResolved$$.next(true);
          break;
        case DOWN_EVENTS.SEND_MESSAGE_RESPONSE:
          this.sentMessageReceipt$$.next(parsedMessage.data);
          break;
        case DOWN_EVENTS.RECEIVE_MESSAGE:
          this.downMessage$$.next(parsedMessage.data);
          break;
        default:
      }
    });
  }

  send(event: UP_EVENTS, data: any) {
    this.socketResolved$$.pipe(
      filter(v => v),
      take(1)
    )
      .subscribe(() => {
        const message = JSON.stringify({
          event,
          data,
        });
        console.log('send', message);
        this.socket.send(message);
      });
  }
}
