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
import {ResidentRentIncreaseReason} from '../../../../../models/resident-rent-increase';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;

  group_title: string = '';

  reasons: { id: ResidentRentIncreaseReason, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private residentSelector$: ResidentSelectorService,
    private admission$: ResidentAdmissionService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      effective_date: [DateHelper.newDate(), Validators.required],
      notification_date: [DateHelper.newDate(), Validators.required],

      reason: [null, Validators.compose([Validators.required])],
      amount: [0, Validators.compose([Validators.required, CoreValidator.payment_amount])],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');

    /// TODO: review
    this.reasons = [
      {id: ResidentRentIncreaseReason.ANNUAL, name: 'Annual'},
      {id: ResidentRentIncreaseReason.CARE_LEVEL_ADJUSTMENT, name: 'Care Level Adjustment'},
    ];

  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
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

}
