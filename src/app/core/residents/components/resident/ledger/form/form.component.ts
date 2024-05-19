import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {CurrencyPipe} from '@angular/common';
import {PaymentSource} from '../../../../models/payment-source';
import {PaymentSourceService} from '../../../../services/payment-source.service';
import {first} from 'rxjs/operators';
import {ResidentLedgerService} from '../../../../services/resident-ledger.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {DateHelper} from '../../../../../../shared/helpers/date-helper';
import {ExpenseItemService} from '../../../../services/expense-item.service';
import {ExpenseItem} from '../../../../models/expense-item';
import {CreditItem} from '../../../../models/credit-item';
import {DiscountItem} from '../../../../models/discount-item';
import {RpPaymentType} from '../../../../models/rp-payment-type';
import {CreditItemService} from '../../../../services/credit-item.service';
import {DiscountItemService} from '../../../../services/discount-item.service';
import {RpPaymentTypeService} from '../../../../services/rp-payment-type.service';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    source_selector: number = null;

    payment_sources: PaymentSource[];

    sources: { id: number, amount: number }[] = [];

    expense_items: ExpenseItem[];
    credit_items: CreditItem[];
    discount_items: DiscountItem[];
    payment_types: RpPaymentType[];

    public isThirdParty: boolean;

    formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

    button_loading: Array<boolean>;

    @ViewChild('addExpenseItem', {static: false}) btn_add_expense_item;
    @ViewChild('addCreditItem', {static: false}) btn_add_credit_item;
    @ViewChild('addDiscountItem', {static: false}) btn_add_discount_item;
    @ViewChild('addPaymentReceivedItem', {static: false}) btn_add_payment_received_item;
    @ViewChild('addAwayDays', {static: false}) btn_add_away_days;

    constructor(
        protected modal$: ModalFormService,
        private formBuilder: FormBuilder,
        private residentSelector$: ResidentSelectorService,
        private ledger$: ResidentLedgerService,
        private payment_source$: PaymentSourceService,
        private expense_item$: ExpenseItemService,
        private credit_item$: CreditItemService,
        private discount_item$: DiscountItemService,
        private payment_type$: RpPaymentTypeService,
    ) {
        super(modal$);

        this.button_loading = new Array<boolean>(100);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],

            amount: [{value: 0, disabled: true}, Validators.compose([Validators.required])],

            balance_due: [{value: 0, disabled: true}, Validators.compose([Validators.required])],

            source: this.formBuilder.array([]),

            resident_expense_items: this.formBuilder.array([]),
            resident_credit_items: this.formBuilder.array([]),
            resident_discount_items: this.formBuilder.array([]),
            resident_payment_received_items: this.formBuilder.array([]),
            resident_away_days: this.formBuilder.array([]),

            resident_id: [null, Validators.required]
        });

        this.subscribe('rs_resident');
        this.subscribe('list_payment_source');
        this.subscribe('list_expense_item');
        this.subscribe('list_credit_item');
        this.subscribe('list_discount_item');
        this.subscribe('list_payment_type');
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
            default:
                break;
        }
    }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'source':
        return this.formBuilder.group({
          id: [{value: null, disabled: true}, Validators.required],
          amount: [{value: null, disabled: true}, Validators.required],
        });
      case 'resident_expense_items':
        return this.formBuilder.group({
          id: [''],
          notes: ['', Validators.compose([Validators.maxLength(512)])],
          amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],
          date: [DateHelper.newDate(), Validators.required],
          expense_item_id: [null, Validators.required],
          ledger_id: [null]
        });
      case 'resident_credit_items':
        return this.formBuilder.group({
          id: [''],
          notes: ['', Validators.compose([Validators.maxLength(512)])],
          amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],
          date: [DateHelper.newDate(), Validators.required],
          credit_item_id: [null, Validators.required],
          ledger_id: [null]
        });
      case 'resident_discount_items':
        return this.formBuilder.group({
          id: [''],
          notes: ['', Validators.compose([Validators.maxLength(512)])],
          amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],
          date: [DateHelper.newDate(), Validators.required],
          discount_item_id: [null, Validators.required],
          ledger_id: [null]
        });
      case 'resident_payment_received_items':
        return this.formBuilder.group({
          id: [''],
          notes: ['', Validators.compose([Validators.maxLength(512)])],
          transaction_number: ['', Validators.compose([Validators.maxLength(32)])],
          amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],
          date: [DateHelper.newDate(), Validators.required],
          payment_type_id: [null, Validators.required],
          ledger_id: [null]
        });
      case 'resident_away_days':
        return this.formBuilder.group({
          id: [''],
          reason: ['', Validators.compose([Validators.maxLength(128)])],
          start: [DateHelper.newDate(), Validators.required],
          end: [DateHelper.newDate(), Validators.required],
          ledger_id: [null]
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

  formValue(): void {
    const value = super.formValue();
    value.resident_expense_items.forEach(expense_item => {
      expense_item.date = DateHelper.makeUTCDateOnly(expense_item.date);
    });
    value.resident_credit_items.forEach(credit_item => {
      credit_item.date = DateHelper.makeUTCDateOnly(credit_item.date);
    });
    value.resident_discount_items.forEach(discount_item => {
      discount_item.date = DateHelper.makeUTCDateOnly(discount_item.date);
    });
    value.resident_payment_received_items.forEach(payment_received_item => {
      payment_received_item.date = DateHelper.makeUTCDateOnly(payment_received_item.date);
    });
    value.resident_away_days.forEach(away_day => {
      away_day.start = DateHelper.makeUTCDateOnly(away_day.start);
      away_day.end = DateHelper.makeUTCDateOnly(away_day.end);
    });
    return value;
  }
}
