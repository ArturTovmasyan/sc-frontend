import {Component, Input, OnInit} from '@angular/core';
import {FormError} from '../../../models/form-error';

@Component({
  selector: 'app-field-errors',
  template: `
    <ng-container *ngFor="let e of errors">
      <span *ngIf="e.error == 'required'">The field is required.</span>
      <span *ngIf="e.error == 'email'">The field must be a valid email address.</span>
      <span *ngIf="e.error == 'backend'">{{ e.params }}</span>
    </ng-container>
  `
})
export class FieldErrorsComponent implements OnInit {
  @Input() errors: FormError[];

  constructor() {
  }

  ngOnInit() {
  }

}
