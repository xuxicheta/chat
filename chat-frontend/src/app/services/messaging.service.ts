import { Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private socket: WebSocket;
  private token: string;
  public close$ = new Subject<CloseEvent>();
  public open$ = new Subject<Event>();
  public error$ = new Subject<Event>();
  public message$ = new Subject<MessageEvent>();

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
      this.send('greetings', 'hello');
    });

    this.close$.pipe(delay(2000)).subscribe((evt) => {
      if (this.token) {
        this.connect(this.token);
      }
    });

    this.message$.subscribe((evt) => {
      const parsedMessage = JSON.parse(evt.data);
      switch (parsedMessage.event) {
        case 'message':
          this.onMessage(parsedMessage);
      }
    });
  }

  onMessage(data) {
    console.log('onMessage data', data);
  }

  send(event: string, data: any) {
    const message = JSON.stringify({
      event,
      data,
    });
    console.log('send', message);
    this.socket.send(message);
  }
}
