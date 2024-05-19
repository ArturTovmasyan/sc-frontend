import {Component, Input, OnInit} from '@angular/core';
import {FormError} from '../../../models/form-error';

@Component({
  selector: 'app-field-errors',
  template: `
    <ng-container *ngFor="let e of errors" [ngSwitch]="e.error">
      <span *ngSwitchCase="'required'">The field is required.&nbsp;</span>
      <span *ngSwitchCase="'email'">The field must be a valid email address.&nbsp;</span>
      <span *ngSwitchCase="'min'">The field minimum value  must be {{ e.params.min }}.</span>
      <span *ngSwitchCase="'max'">The field maximum value  must be {{ e.params.max }}.</span>
      <span *ngSwitchCase="'minlength'">The field minimum length must be {{ e.params.requiredLength }}.</span>
      <span *ngSwitchCase="'maxlength'">The field maximum length must be {{ e.params.requiredLength }}.</span>
      <span *ngSwitchCase="'backend'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'not_empty'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'less_than'">This value must be less than {{ e.params.value }}.</span>
      <span *ngSwitchCase="'greater_than'">This value must be greater than {{ e.params.value }}.</span>
      <span *ngSwitchCase="'earlier_than'">This value must be earlier than {{ e.params.value|date:(e.params.datetime?'MM/dd/yyyy hh:mm aaa':'MM/dd/yyyy') }}.</span>
      <span *ngSwitchCase="'later_than'">This value must be later than {{ e.params.value|date:(e.params.datetime?'MM/dd/yyyy hh:mm aaa':'MM/dd/yyyy') }}.</span>
      <span *ngSwitchCase="'earlier_than_equal'">This value must be earlier than or equal to {{ e.params.value|date:(e.params.datetime?'MM/dd/yyyy hh:mm aaa':'MM/dd/yyyy') }}.</span>
      <span *ngSwitchCase="'later_than_equal'">This value must be later than or equal to {{ e.params.value|date:(e.params.datetime?'MM/dd/yyyy hh:mm aaa':'MM/dd/yyyy') }}.</span>
      <span *ngSwitchCase="'pattern_validator_match_another'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_password'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_phone'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_ssn'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_dosage'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_dosage_unit'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_floor'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_room'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_number_of_floors'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_payment_amount'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_insurance_number'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_group_capacity'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_care_group'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_state_abbr'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'pattern_validator_zip_main'">{{ e.params }}&nbsp;</span>
      <span *ngSwitchCase="'not_null_array'">{{ e.params }}&nbsp;</span>
<!--      <span *ngSwitchDefault>{{ e|json }}</span>-->
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
