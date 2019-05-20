import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {
  @ViewChild('phrasesBox') phrasesBox: ElementRef;

  private phrasesSubs = new Subscription();
  public phrases = [];
  public inputForm: FormGroup;

  get input(): FormControl {
    return this.inputForm.get('input') as FormControl;
  }

  constructor(
    public chatService: ChatService,
    private fb: FormBuilder,
    private renderer: Renderer2,
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
    this.phrasesSubs = this.chatService.getMessagesArray().subscribe(phrases => {
      this.phrases = phrases;
    });
    setTimeout(() => {
      const box = this.phrasesBox.nativeElement as HTMLDivElement;
      // box.scrollTo(document.getElementById(this.phrases[this.phrases.length - 1].))
    })
  }

}
