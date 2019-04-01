import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MessagingService } from 'src/app/services/messaging.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {
  phrases = [];
  inputForm: FormGroup;
  private phrasesSubs = new Subscription();

  get input(): FormControl {
    return this.inputForm.get('input') as FormControl;
  }

  constructor(
    public chatService: ChatService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.inputForm = this.fb.group({
      input: [''],
    });

    this.chatService.selectedContact$.subscribe(() => this.subscribePhrases());
  }

  inputFormOnSubmit(event: Event) {
    event.preventDefault();
    console.log('submitted data', event);
    this.chatService.pushMessage(this.input.value);
    this.input.setValue('');
  }

  subscribePhrases() {
    console.log('subscribePhrases');
    this.phrasesSubs.unsubscribe();
    this.phrasesSubs = this.chatService.getMessagesArray().subscribe(phrases => this.phrases = phrases);
  }

}
