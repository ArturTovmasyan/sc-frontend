import {Component, Input, OnInit} from '@angular/core';
import {FormError} from '../../../models/form-error';

@Component({
  selector: 'app-field-errors',
  template: `
    <ng-container *ngFor="let e of errors">
      <span *ngIf="e.error == 'required'">The field is required.&nbsp;</span>
      <span *ngIf="e.error == 'email'">The field must be a valid email address.&nbsp;</span>
      <span *ngIf="e.error == 'backend'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_match_another'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_password'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_phone'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_dosage'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_dosage_unit'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_floor'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_payment_amount'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_group_capacity'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_state_abbr'">{{ e.params }}&nbsp;</span>
      <span *ngIf="e.error == 'pattern_validator_zip_main'">{{ e.params }}&nbsp;</span>
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
