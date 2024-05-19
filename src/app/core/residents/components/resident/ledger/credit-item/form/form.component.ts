import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {CreditItem} from '../../../../../models/credit-item';
import {CreditItemService} from '../../../../../services/credit-item.service';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {FormComponent as CreditItemFormComponent} from '../../../../credit-item/form/form.component';
import {CoreValidator} from '../../../../../../../shared/utils/core-validator';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  credit_items: CreditItem[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private credit_item$: CreditItemService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'credit_item', component: CreditItemFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],

      start: [DateHelper.newDate(), Validators.required],
      end: [null],

      credit_item_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_credit_item');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_credit_item':
        this.$subscriptions[key] = this.credit_item$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.credit_items = res;

            if (params) {
              this.form.get('credit_item_id').setValue(params.credit_item_id);
            }
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
          }
        });
        break;
      default:
        break;
    }
  }

  public get_credit_amount_disable() {
    const control = this.form.get('credit_item_id').value;

    let credit_item = null;

    if (control && this.credit_items) {
      credit_item = this.credit_items.filter(item => item.id === control).pop();
    }

    return credit_item ? credit_item.amount > 0 ? !credit_item.can_be_changed : false : true;
  }

  public setCreditItemAmount(val) {
    const control = this.form.get('credit_item_id').value;

    let credit_item = null;

    if (control && this.credit_items) {
      credit_item = this.credit_items.filter(item => item.id === val).pop();

      this.form.get('amount').setValue(credit_item && credit_item.amount > 0 ? credit_item.amount : 0);
    }
  }

  formValue(): void {
    const value = super.formValue();
    value.start = DateHelper.makeUTCDateTimeOnly(value.start);

    if (value.end) {
      value.end = DateHelper.makeUTCDateTimeOnly(value.end);
    }

    return value;
  }
}
