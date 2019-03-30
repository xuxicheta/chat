import { Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private socket: WebSocket;
  public close$ = new Subject<CloseEvent>();
  public open$ = new Subject<Event>();
  public error$ = new Subject<Event>();
  public message$ = new Subject<MessageEvent>();

  constructor(
  ) {
    this.listening();
  }

  connect(token) {
    this.socket = new WebSocket(`ws://${location.hostname}:${location.port}/channel?token=${token}`);
    this.socket.onopen = evt => this.open$.next(evt);
    this.socket.onerror = evt => this.error$.next(evt);
    this.socket.onclose = evt => this.close$.next(evt);
    this.socket.onmessage = evt => this.message$.next(evt);
  }

  listening() {
    this.open$.subscribe(evt => {
      this.send('greetings', null);
    });

    this.close$.pipe(delay(1000)).subscribe((evt) => {
      // this.connect();
      console.warn('socket closed');
    });

    this.message$.subscribe((evt) => {
      const data = JSON.parse(evt.data);
      switch (data.method) {
        case 'message':
          this.onMessage(data);
      }
    });
  }

  onMessage(data) {
    console.log('onMessage data', data);
  }

  send(method: string, params: any) {
    const message = JSON.stringify({
      method,
      params,
    });
    console.log('send', message);
    console.log(this.socket);
    this.socket.send(message);
  }
}
