import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: 'message.component.html'
})
export class MessageComponent {
  type: string = 'warning';
  title: string;
  message: string;

  constructor() {
  }


}
