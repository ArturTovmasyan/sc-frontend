﻿import * as _ from 'lodash';
import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {GroupType} from '../../../../models/group-type.enum';
import {FacilityDiningRoomService} from '../../../../services/facility-dining-room.service';
import {FacilityRoomService} from '../../../../services/facility-room.service';
import {ApartmentRoomService} from '../../../../services/apartment-room.service';
import {CareLevelService} from '../../../../services/care-level.service';
import {CityStateZipService} from '../../../../services/city-state-zip.service';
import {CityStateZip} from '../../../../models/city-state-zip';
import {CareLevel} from '../../../../models/care-level';
import {FacilityDiningRoom} from '../../../../models/facility-dining-room';
import {FacilityRoom} from '../../../../models/facility-room';
import {ApartmentRoom} from '../../../../models/apartment-room';
import {FacilityService} from '../../../../services/facility.service';
import {ApartmentService} from '../../../../services/apartment.service';
import {RegionService} from '../../../../services/region.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';
import {AdmissionType, ResidentAdmission} from '../../../../models/resident-admission';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {GroupHelper} from '../../../../helper/group-helper';
import {ResidentService} from '../../../../services/resident.service';
import {DateHelper} from '../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as RentRemoveComponent} from '../../admission/remove/form.component';
import {ResidentRentService} from '../../../../services/resident-rent.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;
  ADMISSION_TYPE = AdmissionType;

  public group_helper: GroupHelper;

  city_state_zips: CityStateZip[];
  care_levels: CareLevel[];
  dining_rooms: FacilityDiningRoom[];
  facility_rooms: FacilityRoom[];
  apartment_rooms: ApartmentRoom[];

  /** TODO: review **/
  group_id: any;
  edit_data: ResidentAdmission;
  /** TODO: review **/

  admission_types: { id: AdmissionType, name: string }[];
  facility_admission_types: { id: AdmissionType, name: string }[];
  apartment_admission_types: { id: AdmissionType, name: string }[];
  resident_state: string;

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private dining_room$: FacilityDiningRoomService,
    private facility_room$: FacilityRoomService,
    private apartment_room$: ApartmentRoomService,
    private care_level$: CareLevelService,
    private csz$: CityStateZipService,
    private residentSelector$: ResidentSelectorService,
    private resident$: ResidentService,
    protected residentRent$: ResidentRentService,
    private nzModal$: NzModalService,
    private _el: ElementRef
  ) {
    super(modal$);

    this.group_helper = new GroupHelper();

    this.facility_admission_types = [
      {id: AdmissionType.LONG_ADMIT, name: 'Long-Term Admit'},
      {id: AdmissionType.SHORT_ADMIT, name: 'Short-Term Admit'},
      {id: AdmissionType.READMIT, name: 'Re-Admit/Assign Room'},
      {id: AdmissionType.ROOM_CHANGE, name: 'Room Change'},
      {id: AdmissionType.TEMPORARY_DISCHARGE, name: 'Temporary Discharge'},
      {id: AdmissionType.PENDING_DISCHARGE, name: 'Pending Discharge'},
      {id: AdmissionType.DISCHARGE, name: 'Discharge'}
    ];

    this.apartment_admission_types = [
      {id: AdmissionType.LONG_ADMIT, name: 'Long-Term Rental'},
      {id: AdmissionType.SHORT_ADMIT, name: 'Short-Term Rental'},
      {id: AdmissionType.READMIT, name: 'Re-admit'},
      {id: AdmissionType.ROOM_CHANGE, name: 'Room Change'},
      {id: AdmissionType.PENDING_DISCHARGE, name: 'Notice to Vacate'},
      {id: AdmissionType.DISCHARGE, name: 'Move Out'}
    ];

    this.admission_types = [];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      admission_type: [null, Validators.required],

      date: [DateHelper.newDate(), Validators.required],
      bill_through_date: [DateHelper.newDate(), Validators.required],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      resident_id: [null, Validators.required],

      group_type: [null, Validators.required],

      group: [null, Validators.required],

      apartment_bed_id: [null, [Validators.required]],
      dining_room_id: [null, [Validators.required]],
      facility_bed_id: [null, [Validators.required]],
      care_group: [null, [Validators.compose([Validators.required, CoreValidator.care_group])]],
      care_level_id: [null, [Validators.required]],
      ambulatory: [false, [Validators.required]],
      dnr: [false, [Validators.required]],
      polst: [false, [Validators.required]],
      region_id: [null, [Validators.required]],
      address: ['', [Validators.required]],
      csz_id: [null, [Validators.required]]
    });

    this.form.get('group').disable();
    this.form.get('group_type').disable();
    this.form.get('bill_through_date').disable();
    this.init_subform(null);

    this.subscribe('rs_resident');
    this.subscribe('vc_admission_type');
    this.subscribe('vc_effective_date');
    this.subscribe('vc_group');

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.tabSelected.next([].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el));
      }
    };
  }

  protected refElement(): ElementRef<any> {
    return this._el;
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'vc_admission_type':
        this.$subscriptions[key] = this.form.get('admission_type').valueChanges.subscribe(next => {
          if (next) {
            switch (next) {
              case AdmissionType.LONG_ADMIT:
              case AdmissionType.SHORT_ADMIT:
              case AdmissionType.READMIT:
              case AdmissionType.ROOM_CHANGE:
                this.form.get('group').enable();
                this.form.get('group_type').enable();
                this.form.get('bill_through_date').disable();
                break;
              case AdmissionType.TEMPORARY_DISCHARGE:
                this.form.get('group').disable();
                this.form.get('group_type').disable();
                this.form.get('bill_through_date').disable();
                this.tabSelected.next(0);
                break;
              case AdmissionType.PENDING_DISCHARGE:
                this.form.get('group').disable();
                this.form.get('group_type').disable();
                this.form.get('bill_through_date').disable();
                this.tabSelected.next(0);
                break;
              case AdmissionType.DISCHARGE:
                this.form.get('group').disable();
                this.form.get('group_type').disable();
                this.form.get('bill_through_date').enable();
                this.tabSelected.next(0);
                break;
            }

            if (this.edit_mode === false && (next === AdmissionType.READMIT || next === AdmissionType.ROOM_CHANGE)) {
              this.subscribe('resident_data');
            }
          }

          this.form.get('date').setValue(this.form.get('date').value);
        });
        break;
      case 'vc_effective_date':
        this.$subscriptions[key] = this.form.get('date').valueChanges.subscribe(next => {
          if (next) {
            const group = this.form.get('group').value;
            const resident_id = this.form.get('resident_id').value;
            if (group && resident_id) {
              switch (group.type) {
                case GroupType.FACILITY:
                  this.subscribe('list_facility_room', {
                    'group_id': group.id,
                    'vacant': 1,
                    'date': next.toISOString(),
                    'resident_id': resident_id
                  });
                  break;
                case GroupType.APARTMENT:
                  this.subscribe('list_apartment_room', {
                    'group_id': group.id,
                    'vacant': 1,
                    'date': next.toISOString(),
                    'resident_id': resident_id
                  });
                  break;
              }
            }
          }
        });
        break;
      case 'resident_data':
        this.$subscriptions[key] = this.resident$.last_admission(this.form.get('resident_id').value).pipe(first()).subscribe(res => {
          if (res) {
            res.id = null;

            res.admission_type = this.form.get('admission_type').value;
            res.date = this.form.get('date').value;
            res.notes = this.form.get('notes').value;

            this.unsubscribe('vc_group');
            this.unsubscribe('vc_admission_type');
            this.before_set_form_data(res);
            this.set_form_data(this, this.form, res);
            this.subscribe('vc_group');
            this.subscribe('vc_admission_type');

            this.form.get('facility_bed_id').setValue(null);
            this.form.get('apartment_bed_id').setValue(null);
            this.form.get('group').setValue(this.form.get('group').value);
          }
        });
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.forEach((v, i) => {
              res[i]['type'] = GroupType.FACILITY;
            });

            this.group_helper.facilities = res;
            if (this.form.get('group_type').value === GroupType.FACILITY && this.form.get('group').value === null) {
              this.form.get('group').setValue(this.group_helper.get_group_data(this.group_id, this.form.get('group_type').value));
            }
          }
        });
        break;
      case 'list_apartment':
        this.$subscriptions[key] = this.apartment$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.forEach((v, i) => {
              res[i]['type'] = GroupType.APARTMENT;
            });

            this.group_helper.apartments = res;
            if (this.form.get('group_type').value === GroupType.APARTMENT && this.form.get('group').value === null) {
              this.form.get('group').setValue(this.group_helper.get_group_data(this.group_id, this.form.get('group_type').value));
            }
          }
        });
        break;
      case 'list_region':
        this.$subscriptions[key] = this.region$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.forEach((v, i) => {
              res[i]['type'] = GroupType.REGION;
            });

            this.group_helper.regions = res;
            if (this.form.get('group_type').value === GroupType.REGION && this.form.get('group').value === null) {
              this.form.get('group').setValue(this.group_helper.get_group_data(this.group_id, this.form.get('group_type').value));
            }
          }
        });
        break;
      case 'vc_group':
        this.$subscriptions[key] = this.form.get('group').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('group_type').setValue(next.type);

            this.init_subform(next);

            if (next.type === GroupType.REGION) {
              this.form.get('region_id').setValue(next.id);
            }

            switch (next.type) {
              case GroupType.FACILITY:
                this.admission_types = this.facility_admission_types;
                break;
              case GroupType.APARTMENT:
                this.admission_types = this.apartment_admission_types;
                break;
              default:
                break;
            }

            this.form.get('date').setValue(this.form.get('date').value);
          }
        });
        break;
      case 'list_apartment_room':
        this.$subscriptions[key] = this.apartment_room$.all([
          {key: 'resident_id', value: params.resident_id},
          {key: 'apartment_id', value: params.group_id},
          {key: 'vacant', value: params.vacant},
          {key: 'date', value: params.date}
        ]).pipe(first()).subscribe(res => {
          if (res) {
            this.apartment_rooms = res;

            if (this.edit_mode) {
              if (this.edit_data.apartment_bed !== null
                && this.edit_data.apartment_bed.room.apartment.id === this.form.get('group').value.id) {
                const rooms = this.apartment_rooms.filter(v => v.id === this.edit_data.apartment_bed.room.id);

                let room;
                if (rooms.length === 0) {
                  room = new FacilityRoom();
                  this.apartment_rooms.push(room);

                  room.id = this.edit_data.apartment_bed.room.id;
                  room.number = this.edit_data.apartment_bed.room.number;
                  room.beds = [this.edit_data.apartment_bed];
                } else {
                  room = rooms[0];
                  room.beds.push(this.edit_data.apartment_bed);
                }
                this.form.get('apartment_bed_id').setValue(this.edit_data.apartment_bed.id);
              } else {
                this.form.get('apartment_bed_id').setValue(null);
              }
            } else {
              this.form.get('apartment_bed_id').setValue(null);
            }
          }
        });
        break;
      case 'list_facility_room':
        this.$subscriptions[key] = this.facility_room$.all([
          {key: 'resident_id', value: params.resident_id},
          {key: 'facility_id', value: params.group_id},
          {key: 'vacant', value: params.vacant},
          {key: 'date', value: params.date}
        ]).pipe(first()).subscribe(res => {
          if (res) {
            this.facility_rooms = res;

            if (this.edit_mode) {
              if (this.edit_data.facility_bed !== null
                && this.edit_data.facility_bed.room.facility.id === this.form.get('group').value.id) {
                const rooms = this.facility_rooms.filter(v => v.id === this.edit_data.facility_bed.room.id);

                let room;
                if (rooms.length === 0) {
                  room = new FacilityRoom();
                  this.facility_rooms.push(room);

                  room.id = this.edit_data.facility_bed.room.id;
                  room.number = this.edit_data.facility_bed.room.number;
                  room.beds = [this.edit_data.facility_bed];
                } else {
                  room = rooms[0];
                  room.beds.push(this.edit_data.facility_bed);
                }
                this.form.get('facility_bed_id').setValue(this.edit_data.facility_bed.id);
              } else {
                this.form.get('facility_bed_id').setValue(null);
              }
            } else {
              this.form.get('facility_bed_id').setValue(null);
            }
          }
        });
        break;
      case 'list_dining_room':
        this.$subscriptions[key] = this.dining_room$.all([{key: 'facility_id', value: params.group_id}])
          .pipe(first()).subscribe(res => {
            if (res) {
              this.dining_rooms = res;

              if (!this.edit_mode) {
                if (this.dining_rooms.filter(v => v.id === this.form.get('dining_room_id').value).length === 0) {
                  this.form.get('dining_room_id').setValue(null);
                }
              } else {
                if (this.edit_data.dining_room !== null) {
                  if (this.dining_rooms.filter(v => v.id === this.edit_data.dining_room.id).length === 0) {
                    this.form.get('dining_room_id').setValue(null);
                  } else {
                    this.form.get('dining_room_id').setValue(this.edit_data.dining_room.id);
                  }
                }
              }
            }
          });
        break;
      case 'list_care_level':
        this.$subscriptions[key] = this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;
          }
        });
        break;
      case 'list_city_state_zip':
        this.$subscriptions[key] = this.csz$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);

            this.subscribe('rs_type');
            this.subscribe('rs_state');
          }
        });
        break;
      case 'rs_type':
        this.$subscriptions[key] = this.residentSelector$.type.subscribe(next => {
          if (next) {
            switch (next) {
              case GroupType.FACILITY:
                this.admission_types = this.facility_admission_types;
                this.subscribe('list_facility');
                break;
              case GroupType.APARTMENT:
                this.admission_types = this.apartment_admission_types;
                this.subscribe('list_apartment');
                break;
              case GroupType.REGION:
                this.subscribe('list_region');
                break;
              default:
                break;
            }
          }
        });
        break;
      case 'rs_state':
        this.$subscriptions[key] = this.residentSelector$.state.subscribe(next => {
          if (next) {
            this.resident_state = next;

            if (this.resident_state === 'no-admission') {
              this.subscribe('list_facility');
              this.subscribe('list_apartment');
              this.subscribe('list_region');

              this.form.get('group').enable();
              this.form.get('group_type').enable();
            }
          }
        });
        break;
      case 'get_last_rent':
        this.$subscriptions[key] = this.residentRent$.getResidentLastRent(params.resident_id).pipe(first()).subscribe(res => {

          // tslint:disable-next-line:max-line-length
          if (res && !this.edit_mode && this.form.get('admission_type').value === AdmissionType.DISCHARGE && this.form.get('date').value <= res.start) {
            this.show_modal_remove(res.id);
          }
        });
        break;
      default:
        break;
    }
  }

  public init_subform(value: any): void {
    this.form.get('apartment_bed_id').disable();
    this.form.get('facility_bed_id').disable();
    this.form.get('dining_room_id').disable();

    this.form.get('region_id').disable();
    this.form.get('address').disable();
    this.form.get('csz_id').disable();

    this.form.get('care_group').disable();
    this.form.get('care_level_id').disable();
    this.form.get('ambulatory').disable();
    this.form.get('dnr').disable();
    this.form.get('polst').disable();

    if (value !== null) {
      const group_id = value.id;
      const group_type = value.type;

      switch (group_type) {
        case GroupType.FACILITY:
          this.form.get('dining_room_id').enable();
          this.form.get('facility_bed_id').enable();
          this.form.get('care_group').enable();
          this.form.get('care_level_id').enable();
          this.form.get('ambulatory').enable();
          this.form.get('dnr').enable();
          this.form.get('polst').enable();

          this.subscribe('list_facility_room', {'group_id': group_id});
          this.subscribe('list_dining_room', {'group_id': group_id});
          this.subscribe('list_care_level');

          break;
        case GroupType.APARTMENT:
          this.form.get('apartment_bed_id').enable();
          this.subscribe('list_apartment_room', {'group_id': group_id});
          break;
        case GroupType.REGION:
          this.form.get('region_id').enable();
          this.form.get('address').enable();
          this.form.get('csz_id').enable();

          this.form.get('care_group').enable();
          this.form.get('care_level_id').enable();
          this.form.get('ambulatory').enable();
          this.form.get('dnr').enable();
          this.form.get('polst').enable();

          this.subscribe('list_city_state_zip');
          this.subscribe('list_care_level');

          break;
      }
    }
  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (data !== null) {
      this.edit_data = _.cloneDeep(data);

      this.form.get('group_type').setValue(data.group_type);
      this.form.get('group').setValue(null);

      switch (this.form.get('group_type').value) {
        case GroupType.FACILITY:
          this.group_id = data.facility_bed.room.facility.id;
          this.admission_types = this.facility_admission_types;
          break;
        case GroupType.APARTMENT:
          this.group_id = data.apartment_bed.room.apartment.id;
          this.admission_types = this.apartment_admission_types;
          break;
        case GroupType.REGION:
          this.group_id = data.region.id;
          break;
        default:
          this.group_id = null;
          break;
      }
    }
  }

  formValue(): void {
    const value = super.formValue();
    value.date = DateHelper.makeUTCDateOnly(value.date);

    if (value.bill_through_date) {
      value.bill_through_date = DateHelper.makeUTCDateOnly(value.bill_through_date);
    }

    return value;
  }

  before_submit(): void {
    this.subscribe('get_last_rent', {resident_id: this.form.get('resident_id').value});
  }

  show_modal_remove(rent_id: number): void {
    let loading = false;

    const modal = this.nzModal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: RentRemoveComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => {
            modal.close();
          }
        },
        {
          type: 'primary',
          label: 'Remove',
          loading: () => loading,
          onClick: () => {
            loading = true;

            const component = <AbstractForm>modal.getContentComponent();
            component.before_submit();
            const form_data = component.formValue();
            component.submitted = true;

            this.residentRent$.remove(form_data).subscribe(
              res => {
                loading = false;
                modal.close();

                this.isSubmitParent = true;
                this.submitParent.next(true);
              },
              error => {
                loading = false;

                component.handleSubmitError(error);
                component.postSubmit(null);
              });
          }
        }
      ]
    });

    modal.afterOpen.subscribe(() => {
      const component = <RentRemoveComponent>modal.getContentComponent();
      component.form.get('id').setValue(rent_id);
    });
  }

  after_submit(): void {
    // const rval = this.residentSelector$.resident.value;
    // this.residentSelector$.resident.next(null);
    // this.residentSelector$.resident.next(rval);

    location.reload();
  }

  get_admission_type() {
    const type = this.admission_types.filter(v => v.id === this.form.get('admission_type').value).pop();
    return type ? type.name : null;
  }

}
