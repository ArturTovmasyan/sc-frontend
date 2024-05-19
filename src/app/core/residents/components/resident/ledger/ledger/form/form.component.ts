import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {CurrencyPipe} from '@angular/common';
import {PaymentSource} from '../../../../../models/payment-source';
import {PaymentSourceService} from '../../../../../services/payment-source.service';
import {first} from 'rxjs/operators';
import {ResidentLedgerService} from '../../../../../services/resident-ledger.service';
import {CoreValidator} from '../../../../../../../shared/utils/core-validator';
import {DateHelper} from '../../../../../../../shared/helpers/date-helper';
import {CreditItem} from '../../../../../models/credit-item';
import {DiscountItem} from '../../../../../models/discount-item';
import {RpPaymentType} from '../../../../../models/rp-payment-type';
import {CreditItemService} from '../../../../../services/credit-item.service';
import {DiscountItemService} from '../../../../../services/discount-item.service';
import {RpPaymentTypeService} from '../../../../../services/rp-payment-type.service';
import {ResidentResponsiblePerson} from '../../../../../models/resident-responsible-person';
import {ResidentResponsiblePersonService} from '../../../../../services/resident-responsible-person.service';
import {ActivatedRoute, Params} from '@angular/router';
import moment from 'moment';
import {LatePayment} from '../../../../../models/late-payment';
import {LatePaymentService} from '../../../../../services/late-payment.service';

@Component({
    templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
    source_selector: number = null;

    payment_sources: PaymentSource[];

    sources: { id: number, amount: number }[] = [];

    credit_items: CreditItem[];
    discount_items: DiscountItem[];
    payment_types: RpPaymentType[];
    responsible_persons: ResidentResponsiblePerson[];

    late_payments: LatePayment[];

    private query_params: Params;

    public isThirdParty: boolean;
    public currentDiscountItemId: number;
    public currentCreditItemId: number;

    formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

    button_loading: Array<boolean>;

    @ViewChild('addCreditItem', {static: false}) btn_add_credit_item;
    @ViewChild('addDiscountItem', {static: false}) btn_add_discount_item;
    @ViewChild('addPrivatePayPaymentReceivedItem', {static: false}) btn_add_private_pay_payment_received_item;
    @ViewChild('addNotPrivatePayPaymentReceivedItem', {static: false}) btn_add_not_private_pay_payment_received_item;

    constructor(
        protected modal$: ModalFormService,
        private formBuilder: FormBuilder,
        private residentSelector$: ResidentSelectorService,
        private route$: ActivatedRoute,
        private ledger$: ResidentLedgerService,
        private payment_source$: PaymentSourceService,
        private credit_item$: CreditItemService,
        private discount_item$: DiscountItemService,
        private payment_type$: RpPaymentTypeService,
        private responsible_person$: ResidentResponsiblePersonService,
        private late_payment$: LatePaymentService,
    ) {
        super(modal$);

        this.button_loading = new Array<boolean>(100);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: [''],

            source: this.formBuilder.array([]),

            resident_credit_items: this.formBuilder.array([]),
            resident_discount_items: this.formBuilder.array([]),
            resident_private_pay_payment_received_items: this.formBuilder.array([]),
            resident_not_private_pay_payment_received_items: this.formBuilder.array([]),

            late_payment_id: [null, Validators.compose([])],

            resident_id: [null, Validators.required]
        });

        this.subscribe('rs_resident');
        this.subscribe('query_map');
        this.subscribe('list_payment_source');
        this.subscribe('list_credit_item');
        this.subscribe('list_discount_item');
        this.subscribe('list_payment_type');
        this.subscribe('list_resident_responsible_person');
        this.subscribe('list_late_payment');
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
            case 'query_map':
              this.$subscriptions[key] = this.route$.queryParams.subscribe(query_params => {
                this.query_params = query_params;
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
            case 'list_resident_responsible_person':
              this.$subscriptions[key] = this.responsible_person$.all([{key: 'resident_id', value: this.query_params['resident_id']}, {key: 'financially', value: true}]).pipe(first()).subscribe(res => {
                if (res) {
                  this.responsible_persons = res;

                  if (params) {
                    this.form.get('responsible_person_id').setValue(params.responsible_person_id);
                  }
                }
              });
              break;
            case 'list_late_payment':
              this.$subscriptions[key] = this.late_payment$.all().pipe(first()).subscribe(res => {
                if (res) {
                  this.late_payments = res;

                  if (params) {
                    this.form.get('late_payment_id').setValue(params.late_payment_id);
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
      case 'resident_private_pay_payment_received_items':
        return this.formBuilder.group({
          id: [''],
          notes: ['', Validators.compose([Validators.maxLength(512)])],
          transaction_number: ['', Validators.compose([Validators.maxLength(32)])],
          amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],
          date: [DateHelper.newDate(), Validators.required],
          payment_type_id: [null, Validators.required],
          responsible_person_id: [null, Validators.required],
          ledger_id: [null]
        });
      case 'resident_not_private_pay_payment_received_items':
        return this.formBuilder.group({
          id: [''],
          notes: ['', Validators.compose([Validators.maxLength(512)])],
          transaction_number: ['', Validators.compose([Validators.maxLength(32)])],
          amount: [0, Validators.compose([Validators.required, Validators.min(1), CoreValidator.payment_amount])],
          date: [DateHelper.newDate(), Validators.required],
          payment_type_id: [null, Validators.required],
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
    value.resident_credit_items.forEach(credit_item => {
      credit_item.date = DateHelper.makeUTCDateOnly(credit_item.date);
    });
    value.resident_discount_items.forEach(discount_item => {
      discount_item.date = DateHelper.makeUTCDateOnly(discount_item.date);
    });
    value.resident_private_pay_payment_received_items.forEach(private_pay_payment_received_item => {
      private_pay_payment_received_item.date = DateHelper.makeUTCDateOnly(private_pay_payment_received_item.date);
    });
    value.resident_not_private_pay_payment_received_items.forEach(not_private_pay_payment_received_item => {
      not_private_pay_payment_received_item.date = DateHelper.makeUTCDateOnly(not_private_pay_payment_received_item.date);
    });
    return value;
  }

  public dateDiff(startDate, endDate) {
    let result = 0;

    if (startDate && endDate) {
      const start = moment(DateHelper.makeUTCDateOnly(startDate));
      const end = moment(DateHelper.makeUTCDateOnly(endDate));
      result = Math.ceil(end.diff(start, 'days', true) + 1);
    }

    return result;
  }

  public get_discount_amount_disable(idx: number) {
    const control = this.get_form_array('resident_discount_items').controls[idx];

    let discount_item = null;

    if (control && this.discount_items) {
      discount_item = this.discount_items.filter(item => item.id === control.get('discount_item_id').value).pop();
    }

    return discount_item ? discount_item.amount > 0 ? !discount_item.can_be_changed : false : true;
  }

  public setDiscountItemAmount(val, idx: number) {
    this.currentDiscountItemId = val;

    const control = this.get_form_array('resident_discount_items').controls[idx];

    let discount_item = null;

    if (control && this.discount_items) {
      discount_item = this.discount_items.filter(item => item.id === this.currentDiscountItemId).pop();

      control.get('amount').setValue(discount_item && discount_item.amount > 0 ? discount_item.amount : 0);
    }
  }

  public get_credit_amount_disable(idx: number) {
    const control = this.get_form_array('resident_credit_items').controls[idx];

    let credit_item = null;

    if (control && this.credit_items) {
      credit_item = this.credit_items.filter(item => item.id === control.get('credit_item_id').value).pop();
    }

    return credit_item ? credit_item.amount > 0 ? !credit_item.can_be_changed : false : true;
  }

  public setCreditItemAmount(val, idx: number) {
    this.currentCreditItemId = val;

    const control = this.get_form_array('resident_credit_items').controls[idx];

    let credit_item = null;

    if (control && this.credit_items) {
      credit_item = this.credit_items.filter(item => item.id === this.currentCreditItemId).pop();

      control.get('amount').setValue(credit_item && credit_item.amount > 0 ? credit_item.amount : 0);
    }
  }
}
