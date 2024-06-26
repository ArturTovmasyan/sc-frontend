﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {PaymentSource} from '../../../../../models/payment-source';
import {PaymentSourceService} from '../../../../../services/payment-source.service';
import {CoreValidator} from '../../../../../../../shared/utils/core-validator';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {GroupType} from '../../../../../models/group-type.enum';
import {ResidentAdmissionService} from '../../../../../services/resident-admission.service';
import {DateHelper} from '../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {ResidentAdmission} from '../../../../../models/resident-admission';
import {FacilityRoomType} from '../../../../../models/facility-room-type';
import {RentReason} from '../../../../../models/rent-reason';
import {RentReasonService} from '../../../../../services/rent-reason.service';
import {FormComponent as RentReasonFormComponent} from '../../../../rent-reason/form/form.component';
import {CurrencyPipe} from '@angular/common';
import {ResidentResponsiblePerson} from '../../../../../models/resident-responsible-person';
import {ResidentResponsiblePersonService} from '../../../../../services/resident-responsible-person.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;

  source_selector: number = null;

  payment_sources: PaymentSource[];
  reasons: RentReason[];

  admission: ResidentAdmission;
  residentResponsiblePersons: ResidentResponsiblePerson[];

  sources: { id: number, amount: number }[] = [];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private payment_source$: PaymentSourceService,
    private reason$: RentReasonService,
    public residentSelector$: ResidentSelectorService,
    private admission$: ResidentAdmissionService,
    private residentResponsiblePerson$: ResidentResponsiblePersonService
  ) {
    super(modal$);
    this.modal_map = [
      {key: 'reason', component: RentReasonFormComponent}
    ];

    this.admission = null;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      start: [DateHelper.newDate(), Validators.required],
      end: [null],

      notes: ['', Validators.compose([Validators.maxLength(512)])],
      amount: [0, Validators.compose([Validators.required, CoreValidator.payment_amount])],

      source: this.formBuilder.array([]),

      resident_id: [null, Validators.required],

      reason_id: [null],
      use_base_rate: [false, Validators.required],
    });

    this.subscribe('rs_resident');
    this.subscribe('vc_use_base_rate');
    this.subscribe('list_reason');
    this.subscribe('list_payment_source');

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
      case 'list_reason':
        this.$subscriptions[key] = this.reason$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.reasons = res;
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
            this.subscribe('list_resident_responsible_person', {resident_id: next});
            this.subscribe('get_resident_admission', {resident_id: next});
          }
        });
        break;
      case 'list_resident_responsible_person':
        this.$subscriptions[key] = this.residentResponsiblePerson$
          .all([{key: 'resident_id', value: params.resident_id}, {key: 'financially', value: true}]).subscribe(res => {
            if (res) {
              this.residentResponsiblePersons = res;
            }
          });
        break;
      case 'get_resident_admission':
        this.$subscriptions[key] = this.admission$.active(params.resident_id).pipe(first()).subscribe(res => {
          if (res) {
            this.admission = res;
          } else {
            this.admission = null;
          }
        }, error => {
          this.admission = null;
        });
        break;
      case 'vc_use_base_rate':
        this.$subscriptions[key] = this.form.get('use_base_rate').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('amount').setValue(this.get_base_room_rate());
          }
        });
        break;
      default:
        break;
    }
  }

  add_source() {
    let source = this.payment_sources.filter(item => item.id === this.source_selector).pop();
    if (source) {
      source.disabled = true;
      source = Object.assign(new PaymentSource(), source); // TODO: review

      const control = this.add_field('source', {
        id: source.id,
        amount: source.get_amount(this.admission.care_level),
        responsible_person_id: null,
        field_text: ''
      });

      if (source.private_pay) {
        control.get('responsible_person_id').enable();
        control.get('field_text').disable();
      } else {
        control.get('responsible_person_id').disable();

        if (source.field_name !== null) {
          control.get('field_text').enable();
        } else {
          control.get('field_text').disable();
        }
      }

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
          responsible_person_id: [null, Validators.required],
          field_text: ['', Validators.compose([Validators.required, Validators.maxLength(32)])],
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

        if (source.private_pay) {
          controls[idx].get('responsible_person_id').enable();
          controls[idx].get('field_text').disable();
        } else {
          controls[idx].get('responsible_person_id').disable();

          if (source.field_name !== null) {
            controls[idx].get('field_text').enable();
          } else {
            controls[idx].get('field_text').disable();
          }
        }
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

  public get_additional_field(idx: number) {
    const control = this.get_form_array('source').controls[idx];

    let source = null;

    if (control && this.payment_sources) {
      source = this.payment_sources.filter(item => item.id === control.get('id').value).pop();
    }

    return source ? source.field_name : '';
  }

  public get_group_title() {
    let group_title = '';
    if (this.admission && this.admission.group_type) {
      switch (this.admission.group_type) {
        case GroupType.FACILITY:
          group_title = this.admission.facility_bed.room.facility.name + ' - #' +
            (!this.admission.facility_bed.room.type || this.admission.facility_bed.room.type.private ?
                this.admission.facility_bed.room.number :
                (this.admission.facility_bed.room.number + ' (' + this.admission.facility_bed.number + ')')
            );
          break;
        case GroupType.REGION:
          group_title = this.admission.region.name;
          break;
        case GroupType.APARTMENT:
          group_title = this.admission.apartment_bed.room.apartment.name + ' - #' +
            (this.admission.apartment_bed.room.private ?
                this.admission.apartment_bed.room.number :
                (this.admission.apartment_bed.room.number + ' (' + this.admission.apartment_bed.number + ')')
            );
          break;
      }
    }
    return group_title;
  }

  public get_base_room_rate() {
    if (this.admission && this.admission.group_type === GroupType.FACILITY && this.admission.facility_bed.room.type) {
      const room_type = Object.assign(new FacilityRoomType(), this.admission.facility_bed.room.type); // TODO: review

      return room_type.get_amount(this.admission.care_level);
    }

    return 0;
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
