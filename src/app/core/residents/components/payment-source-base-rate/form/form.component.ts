import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {CareLevel} from '../../../models/care-level';
import {CareLevelService} from '../../../services/care-level.service';
import {CurrencyPipe} from '@angular/common';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {PaymentSource} from '../../../models/payment-source';
import {PaymentSourceService} from '../../../services/payment-source.service';
import {FormComponent as PaymentSourceFormComponent} from '../../payment-source/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  payment_sources: PaymentSource[];
  care_levels: CareLevel[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private payment_source$: PaymentSourceService,
    private care_level$: CareLevelService
  ) {
    super(modal$);
    this.modal_map = [
      {key: 'payment_source', component: PaymentSourceFormComponent}
    ];

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      date: [DateHelper.newDate(), Validators.required],
      levels: this.formBuilder.array([]),
      payment_source_id: [null, Validators.compose([Validators.required])]
    });

    this.subscribe('list_payment_source');
    this.subscribe('list_care_level');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_payment_source':
        this.$subscriptions[key] = this.payment_source$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.payment_sources = res;

            if (params) {
              this.form.get('payment_source_id').setValue(params.payment_source_id);
            }
          }
        });
        break;
      case 'list_care_level':
        this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;

            if (!this.edit_mode) {
              this.care_levels.forEach(value => {
                this.add_field('levels', {care_level_id: value.id, amount: 0});
              });
            } else {
              if (this.get_form_array('levels').length !== this.care_levels.length) {
                const edit_ids = this.get_form_array('levels').value.map(val => val.care_level_id);
                const all_ids = this.care_levels.map(val => val.id);
                const remaining_ids = all_ids.filter(n => !edit_ids.includes(n));

                if (remaining_ids.length > 0) {
                  const care_levels = this.care_levels.filter(val => remaining_ids.includes(val.id));

                  care_levels.forEach(value => {
                    this.add_field('levels', {care_level_id: value.id, amount: 0});
                  });
                }
              }
            }
          }
        });
        break;
      default:
        break;
    }
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'levels':
        return this.formBuilder.group({
          care_level_id: [null, Validators.required],
          amount: [null, Validators.required],
        });
      default:
        return null;
    }
  }

  before_submit(): void {
    const date = this.form.get('date').value;
    this.form.get('date').setValue(DateHelper.convertFromUTC(date));
  }

}
