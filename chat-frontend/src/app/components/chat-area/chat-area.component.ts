import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  private phrasesSubs = new Subscription();
  public phrases = [];
  public inputForm: FormGroup;

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
    this.inputForm.disable();

    this.chatService.selectedContact$.subscribe(() => {
      this.subscribePhrases();
      this.inputForm.enable();
    });
  }

  inputFormOnSubmit(event: Event) {
    event.preventDefault();
    this.chatService.pushMessage(this.input.value);
    this.input.setValue('');
  }

  subscribePhrases() {
    this.phrasesSubs.unsubscribe();
    this.phrasesSubs = this.chatService.getMessagesArray().subscribe(phrases => this.phrases = phrases);
  }

}
