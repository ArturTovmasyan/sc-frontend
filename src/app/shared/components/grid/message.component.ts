import {Component} from '@angular/core';

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
