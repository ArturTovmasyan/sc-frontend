import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {CurrencyPipe} from '@angular/common';
import {PaymentSource} from '../../../../models/payment-source';
import {PaymentSourceService} from '../../../../services/payment-source.service';
import {first} from 'rxjs/operators';
import {ResidentLedgerService} from '../../../../services/resident-ledger.service';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    source_selector: number = null;

    payment_sources: PaymentSource[];

    sources: { id: number, amount: number }[] = [];

    formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

    constructor(
        protected modal$: ModalFormService,
        private formBuilder: FormBuilder,
        private residentSelector$: ResidentSelectorService,
        private ledger$: ResidentLedgerService,
        private payment_source$: PaymentSourceService,
    ) {
        super(modal$);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],

            amount: [0, Validators.compose([Validators.required])],

            balance_due: [0, Validators.compose([Validators.required])],

            source: this.formBuilder.array([]),

            resident_id: [null, Validators.required]
        });

        this.subscribe('rs_resident');
        this.subscribe('list_payment_source');
    }

    protected subscribe(key: string, params?: any): void {
        switch (key) {
            case 'list_payment_source':
              this.$subscriptions[key] = this.payment_source$.all().pipe(first()).subscribe(res => {
                if (res) {
                  this.payment_sources = res;
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

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'source':
        return this.formBuilder.group({
          id: [null, Validators.required],
          amount: [null, Validators.required],
        });
      default:
        return null;
    }
  }

  public get_title(idx: number) {
    const control = this.get_form_array('source').controls[idx];

    let source = null;

    if (control && this.payment_sources) {
      source = this.payment_sources.filter(item => item.id === control.get('id').value).pop();
    }

    return source ? source.title : '';
  }
}
