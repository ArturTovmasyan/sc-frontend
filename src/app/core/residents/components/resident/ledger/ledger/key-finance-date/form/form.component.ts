import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../../shared/components/abstract-form/abstract-form';
import {KeyFinanceType} from '../../../../../../models/key-finance-type';
import {KeyFinanceTypeService} from '../../../../../../services/key-finance-type.service';
import {ResidentSelectorService} from '../../../../../../services/resident-selector.service';
import {DateHelper} from '../../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../../shared/services/modal-form.service';
import {FormComponent as KeyFinanceTypeFormComponent} from '../../../../../key-finance-type/form/form.component';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  key_finance_types: KeyFinanceType[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private key_finance_type$: KeyFinanceTypeService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'key_finance_type', component: KeyFinanceTypeFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      date: [DateHelper.newDate(), Validators.required],

      key_finance_type_id: [null, Validators.required],

      ledger_id: [null, Validators.required]
    });

    this.subscribe('rs_ledger');
    this.subscribe('list_key_finance_type');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_key_finance_type':
        this.$subscriptions[key] = this.key_finance_type$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.key_finance_types = res;

            if (params) {
              this.form.get('key_finance_type_id').setValue(params.key_finance_type_id);
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
