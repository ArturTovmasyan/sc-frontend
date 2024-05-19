import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../../shared/components/abstract-form/abstract-form';
import {CreditDiscountItem} from '../../../../../../models/credit-discount-item';
import {CreditDiscountItemService} from '../../../../../../services/credit-discount-item.service';
import {ResidentSelectorService} from '../../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../../shared/services/modal-form.service';
import {FormComponent as CreditDiscountItemFormComponent} from '../../../../../credit-discount-item/form/form.component';
import {CoreValidator} from '../../../../../../../../shared/utils/core-validator';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  credit_discount_items: CreditDiscountItem[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private credit_discount_item$: CreditDiscountItemService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'credit_discount_item', component: CreditDiscountItemFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],

      date: [DateHelper.newDate(), Validators.required],

      credit_discount_item_id: [null, Validators.required],

      ledger_id: [null, Validators.required]
    });

    this.subscribe('rs_ledger');
    this.subscribe('list_credit_discount_item');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_credit_discount_item':
        this.$subscriptions[key] = this.credit_discount_item$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.credit_discount_items = res;

            if (params) {
              this.form.get('credit_discount_item_id').setValue(params.credit_discount_item_id);
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
