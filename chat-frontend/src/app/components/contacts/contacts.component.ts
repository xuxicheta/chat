import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  @Output() selectedContactChange = new EventEmitter<string>();

  constructor(
    public profileService: ProfileService,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.profileService.user$.subscribe((user) => {
      if (user.contacts && user.contacts.length) {
        this.selectContact(user.contacts[0].userId);
      }
    });
  }

  onContactClick(contactId: string) {
    this.selectContact(contactId);
  }

  selectContact(contactId: string) {
    this.chatService.onSelectContact(contactId);
  }

}
