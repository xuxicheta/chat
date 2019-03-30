import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrls: ['./input-area.component.scss']
})
export class InputAreaComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messagingService: MessagingService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      input: [''],
    });
  }

  formOnSubmit(event: Event) {
    console.log('submitted data', event);
    this.messagingService.send('upMessage', { test: this.form.value.input });
    this.form.get('input').setValue('');
    event.preventDefault();
  }

}
