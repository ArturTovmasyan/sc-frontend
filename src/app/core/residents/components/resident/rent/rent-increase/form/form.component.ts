import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {CoreValidator} from '../../../../../../../shared/utils/core-validator';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {GroupType} from '../../../../../models/group-type.enum';
import {ResidentAdmissionService} from '../../../../../services/resident-admission.service';
import {DateHelper} from '../../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {RentReasonService} from '../../../../../services/rent-reason.service';
import {RentReason} from '../../../../../models/rent-reason';
import {ResidentAdmission} from '../../../../../models/resident-admission';
import {FormComponent as RentReasonFormComponent} from '../../../../rent-reason/form/form.component';
import {FacilityRoomType} from '../../../../../models/facility-room-type';
import {CurrencyPipe} from '@angular/common';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;

  admission: ResidentAdmission;
  reasons: RentReason[];

  formatterDollar = (value: number) => (new CurrencyPipe('en-US')).transform(value, 'USD', 'symbol-narrow', '1.2-2');

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private reason$: RentReasonService,
    private residentSelector$: ResidentSelectorService,
    private admission$: ResidentAdmissionService
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

      effective_date: [DateHelper.newDate(), Validators.required],
      notification_date: [DateHelper.newDate(), Validators.required],

      reason_id: [null, Validators.required],
      amount: [0, Validators.compose([Validators.required, CoreValidator.payment_amount])],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_reason');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_reason':
        this.$subscriptions[key] = this.reason$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.reasons = res;

            if (params) {
              this.form.get('reason_id').setValue(params.reason_id);
            }
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
            this.subscribe('get_resident_admission');
          }
        });
        break;
      case 'get_resident_admission':
        this.$subscriptions[key] = this.admission$.active(this.form.get('resident_id').value).pipe(first()).subscribe(res => {
          if (res) {
            this.admission = res;

            if (!this.edit_mode) {
              this.form.get('amount').setValue(this.get_base_room_rate());
            }
          } else {
            this.admission = null;
          }
        }, error => {
          this.admission = null;
        });
        break;
      default:
        break;
    }
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

}
