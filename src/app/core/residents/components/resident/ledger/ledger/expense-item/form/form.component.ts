import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../../shared/components/abstract-form/abstract-form';
import {ExpenseItem} from '../../../../../../models/expense-item';
import {ExpenseItemService} from '../../../../../../services/expense-item.service';
import {ResidentSelectorService} from '../../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../../shared/services/modal-form.service';
import {FormComponent as ExpenseItemFormComponent} from '../../../../../expense-item/form/form.component';
import {CoreValidator} from '../../../../../../../../shared/utils/core-validator';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  expense_items: ExpenseItem[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private expense_item$: ExpenseItemService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'expense_item', component: ExpenseItemFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],

      date: [DateHelper.newDate(), Validators.required],

      expense_item_id: [null, Validators.required],

      ledger_id: [null, Validators.required]
    });

    this.subscribe('rs_ledger');
    this.subscribe('list_expense_item');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_expense_item':
        this.$subscriptions[key] = this.expense_item$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.expense_items = res;

            if (params) {
              this.form.get('expense_item_id').setValue(params.expense_item_id);
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
