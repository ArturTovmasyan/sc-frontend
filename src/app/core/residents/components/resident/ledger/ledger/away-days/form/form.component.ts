import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../../shared/services/modal-form.service';
import {CoreValidator} from '../../../../../../../../shared/utils/core-validator';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      reason: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(128)])],

      start: [DateHelper.newDate(), Validators.required],

      end: [DateHelper.newDate(), Validators.required],

      ledger_id: [null, Validators.required]
    });

    this.subscribe('rs_ledger');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_ledger':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('ledger_id').setValue(next);
          }
        });
        break;
      default:
        break;
    }
  }

  formValue(): void {
    const value = super.formValue();
    value.start = DateHelper.makeUTCDateOnly(value.start);
    value.end = DateHelper.makeUTCDateOnly(value.end);
    return value;
  }
}
