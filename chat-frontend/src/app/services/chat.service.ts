import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Message } from '../common/classes/message';

interface Messages {
  [contact: string]: BehaviorSubject<Message[]>;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  selectedContact$ = new ReplaySubject<string>(1);
  private selectedContact: string;
  private messages: Messages = {};

  constructor() {
    this.selectedContact$.subscribe(contact => this.selectedContact = contact);
  }

  pushMessage(text: string) {
    console.log('push messages', text);
    const arr = this.messages[this.selectedContact].getValue().slice();
    arr.push(new Message(text));
    this.messages[this.selectedContact].next(arr);
  }

  getMessagesArray(): BehaviorSubject<Message[]> {
    return this.messages[this.selectedContact];
  }

  onSelectContact(contactId) {
    if (contactId === this.selectedContact) {
      return;
    }
    console.log('onSelectContact', contactId);

    if (!this.messages[contactId]) {
      this.messages[contactId] = new BehaviorSubject([]);
    }

    this.selectedContact$.next(contactId);
  }
}
