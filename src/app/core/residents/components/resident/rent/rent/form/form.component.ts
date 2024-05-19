import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {PaymentSource} from '../../../../../models/payment-source';
import {PaymentSourceService} from '../../../../../services/payment-source.service';
import {CoreValidator} from '../../../../../../../shared/utils/core-validator';
import {PaymentPeriod} from '../../../../../models/payment-period.enum';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {GroupType} from '../../../../../models/group-type.enum';
import {ResidentAdmissionService} from '../../../../../services/resident-admission.service';
import {DateHelper} from '../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;

  source_selector: number = null;

  payment_sources: PaymentSource[];

  group_title: string = '';

  sources: { id: number, amount: number }[] = [];
  periods: { id: PaymentPeriod, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private payment_source$: PaymentSourceService,
    private residentSelector$: ResidentSelectorService,
    private admission$: ResidentAdmissionService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      start: [new Date(), Validators.required],
      end: [null],

      period: [null, Validators.required],

      notes: ['', Validators.compose([Validators.maxLength(512)])],
      amount: [0, Validators.compose([Validators.required, CoreValidator.payment_amount])],

      source: this.formBuilder.array([]),

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_payment_source');

    /// TODO: review
    this.periods = [
      {id: PaymentPeriod.HOURLY, name: 'Hourly'},
      {id: PaymentPeriod.DAILY, name: 'Daily'},
      {id: PaymentPeriod.WEEKLY, name: 'Weekly'},
      {id: PaymentPeriod.MONTHLY, name: 'Monthly'},
    ];

  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_payment_source':
        this.$subscriptions[key] = this.payment_source$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.payment_sources = res;
            this.payment_sources.forEach(v => v.disabled = false);

            this.after_set_form_data();
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
            this.subscribe('resident_info');
          }
        });
        break;
      case 'resident_info':
        this.$subscriptions[key] = this.admission$.active(this.form.get('resident_id').value).pipe(first()).subscribe(res => {
          if (res != null && !Array.isArray(res)) {
            const admission = res;

            this.group_title = '';
            if (admission.group_type) {
              switch (admission.group_type) {
                case GroupType.FACILITY:
                  this.group_title = admission.facility_bed.room.facility.name + ' - #' +
                    (admission.facility_bed.room.private ?
                        admission.facility_bed.room.number :
                        (admission.facility_bed.room.number + ' (' + admission.facility_bed.number + ')')
                    );
                  break;
                case GroupType.REGION:
                  this.group_title = admission.region.name;
                  break;
                case GroupType.APARTMENT:
                  this.group_title = admission.apartment_bed.room.apartment.name + ' - #' +
                    (admission.apartment_bed.room.private ?
                        admission.apartment_bed.room.number :
                        (admission.apartment_bed.room.number + ' (' + admission.apartment_bed.number + ')')
                    );
                  break;
              }
            }
          } else {
            this.group_title = '';
          }
        }, error => {
          this.group_title = '';
        });
        break;
      default:
        break;
    }
  }

  add_source() {
    const source = this.payment_sources.filter(item => item.id === this.source_selector).pop();
    if (source) {
      source.disabled = true;

      this.add_field('source', {id: source.id, amount: 0});

      this.source_selector = null;
    }
  }

  remove_source(i: number) {
    const control = this.get_form_array('source').controls[i];

    if (control) {
      const source = this.payment_sources.filter(item => item.id === control.get('id').value).pop();
      source.disabled = false;
      this.remove_field('source', i);
    }
  }

  remaining() {
    const controls = this.get_form_array('source').controls;

    return this.form.get('amount').value - Object.keys(controls).reduce((previous, key) => {
      return controls[key].get('amount').value + previous;
    }, 0);
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

  public after_set_form_data(): void {
    const controls = this.get_form_array('source').controls;

    if (controls && this.payment_sources) {
      Object.keys(controls).forEach(idx => {
        const source = this.payment_sources.filter(item => item.id === controls[idx].get('id').value).pop();
        source.disabled = true;
      });
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
