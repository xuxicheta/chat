import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Message, IMessage } from '../common/classes/message';
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
  public userId: string;
  private selectedContact: string;
  private messages: Messages = {};

  get messagesArray$() {
    return this.messages[this.selectedContact].asObservable();
  }

  constructor(
    private profileService: ProfileService,
    private messagingsService: MessagingService,
  ) {
    this.profileService.user$.subscribe(user => this.userId = user.userId);
    this.selectedContact$.subscribe(contact => this.selectedContact = contact);
    this.subscribeOnDownMessages();
  }

  pushMessage(text: string) {
    const arr = this.messages[this.selectedContact].getValue().slice();
    const message = new Message({
      text,
      from: this.userId,
      to: this.selectedContact,
      createdAt: new Date(),
    });
    arr.push(message);
    this.messages[this.selectedContact].next(arr);
    this.messagingsService.send(UP_EVENTS.SEND_MESSAGE, message);
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

  subscribeOnDownMessages() {
    this.messagingsService.downMessage$.subscribe((incomes: IMessage[]) => {
      const array = this.messages[this.selectedContact].value;
      const newArray = array.concat(
        incomes.map(income => new Message(income)),
      );
      newArray.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      this.messages[this.selectedContact].next(newArray);
    });
  }
}
