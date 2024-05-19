import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
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

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GROUP_TYPE = GroupType;

  selectedTab: number;

  protected group_helper: GroupHelper;

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
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private dining_room$: FacilityDiningRoomService,
    private facility_room$: FacilityRoomService,
    private apartment_room$: ApartmentRoomService,
    private care_level$: CareLevelService,
    private city_state_zip$: CityStateZipService,
    private residentSelector$: ResidentSelectorService,
    private _el: ElementRef
  ) {
    super();

    this.group_helper = new GroupHelper();

    this.selectedTab = 0;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      admission_type: [null, Validators.required],

      date: [new Date(), Validators.required],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      resident_id: [null, Validators.required],

      group_type: [null, Validators.required],

      group: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_facility');
    this.subscribe('list_apartment');
    this.subscribe('list_region');
    this.subscribe('vc_group');

    // TODO: review
    this.admission_types = [
      {id: AdmissionType.ADMIT, name: 'Admit'},
      {id: AdmissionType.READMIT, name: 'Re-Admit'},
      {id: AdmissionType.TEMPORARY_DISCHARGE, name: 'Temporary Discharge'},
      {id: AdmissionType.DISCHARGE, name: 'Discharge'}
    ];

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.forEach((v, i) => {
              res[i]['type'] = GroupType.FACILITY;
            });

            this.group_helper.facilities = res;
            if (this.form.get('group').value === null) {
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
            if (this.form.get('group').value === null) {
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

            if (this.form.get('group').value === null) {
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
          }
        });
        break;
      case 'list_dining_room':
        this.$subscriptions[key] = this.dining_room$.all([{key: 'facility_id', value: params['group_id']}])
          .pipe(first()).subscribe(res => {
            if (res) {
              this.dining_rooms = res;
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
        this.$subscriptions[key] = this.city_state_zip$.all().pipe(first()).subscribe(res => {
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
    this.form.removeControl('apartment_bed_id');
    this.form.removeControl('facility_bed_id');
    this.form.removeControl('dining_room_id');

    this.form.removeControl('region_id');
    this.form.removeControl('address');
    this.form.removeControl('csz_id');

    this.form.removeControl('care_group');
    this.form.removeControl('care_level_id');
    this.form.removeControl('ambulatory');
    this.form.removeControl('dnr');
    this.form.removeControl('polst');

    const group_id = value.id;
    const group_type = value.type;

    switch (group_type) {
      case GroupType.FACILITY:


        this.form.addControl('dining_room_id', new FormControl(null, [Validators.required]));
        this.form.addControl('facility_bed_id', new FormControl(null, [Validators.required]));
        this.form.addControl('care_group', new FormControl(null, [Validators.compose([Validators.required, CoreValidator.care_group])]));
        this.form.addControl('care_level_id', new FormControl(null, [Validators.required]));
        this.form.addControl('ambulatory', new FormControl(false, [Validators.required]));
        this.form.addControl('dnr', new FormControl(false, [Validators.required]));
        this.form.addControl('polst', new FormControl(false, [Validators.required]));

        this.subscribe('list_facility_room', {'group_id': group_id});
        this.subscribe('list_dining_room', {'group_id': group_id});
        this.subscribe('list_care_level');

        break;
      case GroupType.APARTMENT:
        this.form.removeControl('dining_room_id');
        this.form.removeControl('facility_bed_id');
        this.form.removeControl('care_group');
        this.form.removeControl('care_level_id');
        this.form.removeControl('ambulatory');
        this.form.removeControl('dnr');
        this.form.removeControl('polst');

        this.form.addControl('apartment_bed_id', new FormControl(null, [Validators.required]));
        this.subscribe('list_apartment_room', {'group_id': group_id});
        break;
      case GroupType.REGION:
        this.form.addControl('region_id', new FormControl(null, [Validators.required]));
        this.form.addControl('address', new FormControl('', [Validators.required]));
        this.form.addControl('csz_id', new FormControl(null, [Validators.required]));

        this.form.addControl('care_group', new FormControl(null, [Validators.compose([Validators.required, CoreValidator.care_group])]));
        this.form.addControl('care_level_id', new FormControl(null, [Validators.required]));
        this.form.addControl('ambulatory', new FormControl(false, [Validators.required]));
        this.form.addControl('dnr', new FormControl(false, [Validators.required]));
        this.form.addControl('polst', new FormControl(false, [Validators.required]));

        this.subscribe('list_city_state_zip');
        this.subscribe('list_care_level');

        break;
    }

    // if (this.edit_data !== null && group_id === this.group_id) {
    //   this.set_form_data(this, this.form, this.edit_data);
    // }
  }

  before_set_form_data(data: any): void {
    if (data !== null) {
      this.edit_data = data;

      this.form.get('group_type').setValue(data.type);

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
      }
    }
  }

}
