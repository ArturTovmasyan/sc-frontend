import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {DiscountItem} from '../../../../../models/discount-item';
import {DiscountItemService} from '../../../../../services/discount-item.service';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {FormComponent as DiscountItemFormComponent} from '../../../../discount-item/form/form.component';
import {CoreValidator} from '../../../../../../../shared/utils/core-validator';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  discount_items: DiscountItem[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private discount_item$: DiscountItemService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'discount_item', component: DiscountItemFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],

      start: [DateHelper.newDate(), Validators.required],
      end: [null],

      discount_item_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_discount_item');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_discount_item':
        this.$subscriptions[key] = this.discount_item$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.discount_items = res;

            if (params) {
              this.form.get('discount_item_id').setValue(params.discount_item_id);
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

  public get_discount_amount_disable() {
    const control = this.form.get('discount_item_id').value;

    let discount_item = null;

    if (control && this.discount_items) {
      discount_item = this.discount_items.filter(item => item.id === control).pop();
    }

    return discount_item ? discount_item.amount > 0 ? !discount_item.can_be_changed : false : true;
  }

  public setDiscountItemAmount(val) {
    const control = this.form.get('discount_item_id').value;

    let discount_item = null;

    if (control && this.discount_items) {
      discount_item = this.discount_items.filter(item => item.id === val).pop();

      this.form.get('amount').setValue(discount_item && discount_item.amount > 0 ? discount_item.amount : 0);
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
