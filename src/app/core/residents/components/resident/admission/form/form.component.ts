import * as _ from 'lodash';
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

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;

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
    private _el: ElementRef
  ) {
    super(modal$);

    this.group_helper = new GroupHelper();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      admission_type: [null, Validators.required],

      date: [DateHelper.newDate(), Validators.required],
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
    this.init_subform(null);

    this.subscribe('rs_resident');
    this.subscribe('vc_admission_type');
    this.subscribe('vc_group');

    // TODO: review
    this.admission_types = [
      {id: AdmissionType.LONG_ADMIT, name: 'Long-Term Admit'},
      {id: AdmissionType.SHORT_ADMIT, name: 'Short-Term Admit'},
      {id: AdmissionType.READMIT, name: 'Re-Admit/Assign Room'},
      {id: AdmissionType.TEMPORARY_DISCHARGE, name: 'Temporary Discharge'},
      {id: AdmissionType.PENDING_DISCHARGE, name: 'Pending Discharge'},
      {id: AdmissionType.DISCHARGE, name: 'Discharge'}
    ];

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
                this.form.get('group').enable();
                this.form.get('group_type').enable();
                break;
              case AdmissionType.TEMPORARY_DISCHARGE:
              case AdmissionType.PENDING_DISCHARGE:
              case AdmissionType.DISCHARGE:
                this.form.get('group').disable();
                this.form.get('group_type').disable();
                this.tabSelected.next(0);
                break;
            }

            if (this.edit_mode === false && next === AdmissionType.READMIT) {
              this.subscribe('resident_data');
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
          }
        });
        break;
      case 'list_apartment_room':
        this.$subscriptions[key] = this.apartment_room$.all([{key: 'apartment_id', value: params['group_id']}, {
          key: 'vacant',
          value: 1
        }]).pipe(first()).subscribe(res => {
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
            }
          }
        });
        break;
      case 'list_facility_room':
        this.$subscriptions[key] = this.facility_room$.all([{key: 'facility_id', value: params['group_id']}, {
          key: 'vacant',
          value: 1
        }]).pipe(first()).subscribe(res => {
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
            }
          }
        });
        break;
      case 'list_dining_room':
        this.$subscriptions[key] = this.dining_room$.all([{key: 'facility_id', value: params['group_id']}])
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
          break;
        case GroupType.APARTMENT:
          this.group_id = data.apartment_bed.room.apartment.id;
          break;
        case GroupType.REGION:
          this.group_id = data.region.id;
          break;
        default:
          this.group_id = null;
          break;
      }
    }

    this.subscribe('list_facility');
    this.subscribe('list_apartment');
    this.subscribe('list_region');
  }

  before_submit(): void {
    this.form.get('date').setValue(DateHelper.magicDate(this.form.get('date').value)); // TODO: #846 - Review date/time fields in all system
  }

  after_submit(): void {
    const rval = this.residentSelector$.resident.value;
    this.residentSelector$.resident.next(null);
    this.residentSelector$.resident.next(rval);
  }

  get_admission_type() {
    const type = this.admission_types.filter(v => v.id === this.form.get('admission_type').value).pop();
    return type ? type.name : null;
  }

}
