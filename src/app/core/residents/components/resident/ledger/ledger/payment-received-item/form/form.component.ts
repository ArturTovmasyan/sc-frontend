import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../../shared/components/abstract-form/abstract-form';
import {RpPaymentType} from '../../../../../../models/rp-payment-type';
import {RpPaymentTypeService} from '../../../../../../services/rp-payment-type.service';
import {ResidentSelectorService} from '../../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../../shared/services/modal-form.service';
import {FormComponent as RpPaymentTypeFormComponent} from '../../../../../rp-payment-type/form/form.component';
import {CoreValidator} from '../../../../../../../../shared/utils/core-validator';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  payment_types: RpPaymentType[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private payment_type$: RpPaymentTypeService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'payment_type', component: RpPaymentTypeFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      transaction_number: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(32)])],

      amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],

      date: [DateHelper.newDate(), Validators.required],

      payment_type_id: [null, Validators.required],

      ledger_id: [null, Validators.required]
    });

    this.subscribe('rs_ledger');
    this.subscribe('list_payment_type');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_payment_type':
        this.$subscriptions[key] = this.payment_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.payment_types = res;

            if (params) {
              this.form.get('payment_type_id').setValue(params.payment_type_id);
            }
          }
        });
        break;
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
    value.date = DateHelper.makeUTCDateOnly(value.date);
    return value;
  }
}
