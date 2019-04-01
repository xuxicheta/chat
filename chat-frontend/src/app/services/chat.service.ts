import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Message } from '../common/classes/message';
import { ProfileService } from './profile.service';
import { MessagingService, DOWN_EVENTS, UP_EVENTS } from './messaging.service';

interface Messages {
  [contact: string]: BehaviorSubject<Message[]>;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  selectedContact$ = new ReplaySubject<string>(1);
  private userId: string;
  private selectedContact: string;
  private messages: Messages = {};

  constructor(
    private profileService: ProfileService,
    private messagingsService: MessagingService,
  ) {
    this.profileService.user$.subscribe(user => this.userId = user.userId);
    this.selectedContact$.subscribe(contact => this.selectedContact = contact);
  }

  pushMessage(text: string) {
    console.log('push messages', text);
    const arr = this.messages[this.selectedContact].getValue().slice();
    const message = new Message(text, this.userId, this.selectedContact);
    arr.push(message);
    this.messages[this.selectedContact].next(arr);
    this.messagingsService.send(UP_EVENTS.SEND_MESSAGE, message);
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
    this.messagingsService.send(UP_EVENTS.LAST_MESSAGES, contactId);

    this.selectedContact$.next(contactId);

  }
}
