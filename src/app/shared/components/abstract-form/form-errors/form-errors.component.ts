import {Component, Input, OnInit} from '@angular/core';
import {FormError} from '../../../models/form-error';

@Component({
  selector: 'app-form-errors',
  template: `
    <span *ngFor="let e of errors">{{ e.params }}</span><br/>
  `
})
export class FormErrorsComponent implements OnInit {

  @Input() errors: FormError[];

  constructor() {
  }

  ngOnInit() {
  }

}
