import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit, OnDestroy {
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

  ngOnDestroy() {
    this.phrasesSubs.unsubscribe();
  }

  inputFormOnSubmit(event: Event) {
    event.preventDefault();
    this.chatService.pushMessage(this.input.value);
    this.input.setValue('');
  }

  subscribePhrases() {
    this.phrasesSubs.unsubscribe();
    this.phrasesSubs = this.chatService.messagesArray$.subscribe(phrases => {
      console.log('phases incoming', phrases);
      this.phrases = phrases;

      setTimeout(() => {
        if (this.phrasesBox) {
          const box = this.phrasesBox.nativeElement as HTMLDivElement;
          const lastElement = box.children[box.children.length - 1];
          if (lastElement) {
            lastElement.scrollIntoView();
          }
        }
      });
    });

  }

}
