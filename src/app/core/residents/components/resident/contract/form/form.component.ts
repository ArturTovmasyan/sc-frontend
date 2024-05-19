import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ActivatedRoute} from '@angular/router';
import {ResidentType} from '../../../../models/resident-type.enum';
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
import {ResidentContract, State} from '../../../../models/resident-contract';
import {Apartment} from '../../../../models/apartment';
import {Facility} from '../../../../models/facility';
import {Region} from '../../../../models/region';
import {FacilityService} from '../../../../services/facility.service';
import {ApartmentService} from '../../../../services/apartment.service';
import {RegionService} from '../../../../services/region.service';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  ResidentType = ResidentType;

  apartments: Apartment[];
  facilities: Facility[];
  regions: Region[];

  city_state_zips: CityStateZip[];
  care_levels: CareLevel[];
  dining_rooms: FacilityDiningRoom[];
  facility_rooms: FacilityRoom[];
  apartment_rooms: ApartmentRoom[];

  /** TODO: review **/
  group_id: any;
  edit_data: ResidentContract;
  /** TODO: review **/

  resident_id: number;
  selectedTab: number;

  states: { id: State, name: string }[];

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
    private route$: ActivatedRoute,
    private _el: ElementRef) {
    super();

    // this.loaded.next(false);
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],

      start: [new Date(), Validators.required],
      end: [null],

      group: [null, Validators.required],
      type: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required],

      option: [null]
    });

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.forEach((v, i) => {
          res[i]['type'] = ResidentType.FACILITY;
        });

        this.facilities = res;
        if (this.form.get('group').value === null) {
          this.form.get('group').setValue(this.get_group_data(this.group_id));
        }
      }
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.forEach((v, i) => {
          res[i]['type'] = ResidentType.APARTMENT;
        });

        this.apartments = res;
        if (this.form.get('group').value === null) {
          this.form.get('group').setValue(this.get_group_data(this.group_id));
        }
      }
    });

    this.region$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.forEach((v, i) => {
          res[i]['type'] = ResidentType.REGION;
        });

        this.regions = res;

        if (this.form.get('group').value === null) {
          this.form.get('group').setValue(this.get_group_data(this.group_id));
        }
      }
    });

    this.form.get('group').valueChanges.subscribe(next => {
      if (next) {
        this.form.get('type').setValue(next.type);
        this.init_subform(next);
      }
    });

    this.states = [
      {id: State.ACTIVE, name: 'Active'},
      {id: State.SUSPENDED, name: 'Suspended'},
      {id: State.TERMINATED, name: 'Terminated'}
    ];

    this.selectedTab = 0;
    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };
  }

  public init_subform(value: any): void {
    let option = this.formBuilder.group({});

    const group_id = value.id;
    const group_type = value.type;

    switch (group_type) {
      case ResidentType.FACILITY:
        option = this.formBuilder.group({
          state: [null, Validators.required],

          care_group: [null, Validators.compose([Validators.required, CoreValidator.care_group])],
          care_level_id: [null, Validators.required],
          ambulatory: [false, Validators.required],
          dnr: [false, Validators.required],
          polst: [false, Validators.required],

          bed_id: [null, Validators.required],
          dining_room_id: [null, Validators.required],
        });
        this.facility_room$.all([{key: 'facility_id', value: group_id}, {key: 'vacant', value: 1}]).pipe(first()).subscribe(res => {
          if (res) {
            this.facility_rooms = res;
          }
        });
        this.dining_room$.all([{key: 'facility_id', value: group_id}]).pipe(first()).subscribe(res => {
          if (res) {
            this.dining_rooms = res;
          }
        });
        this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;
          }
        });
        break;
      case ResidentType.APARTMENT:
        option = this.formBuilder.group({
          state: [null, Validators.required],

          bed_id: [null, Validators.required],
        });
        this.apartment_room$.all([{key: 'apartment_id', value: group_id}, {key: 'vacant', value: 1}]).pipe(first()).subscribe(res => {
          if (res) {
            this.apartment_rooms = res;
          }
        });
        break;
      case ResidentType.REGION:
        option = this.formBuilder.group({
          state: [null, Validators.required],

          care_group: [null, Validators.compose([Validators.required, CoreValidator.care_group])],
          care_level_id: [null, Validators.required],
          ambulatory: [false, Validators.required],
          dnr: [false, Validators.required],
          polst: [false, Validators.required],

          street_address: ['', Validators.required],
          csz_id: [null, Validators.required],
          region_id: [group_id, Validators.required],
        });
        this.city_state_zip$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;
          }
        });
        this.care_level$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_levels = res;
          }
        });
        break;
    }

    if (this.edit_data !== null && group_id === this.group_id) {
      this.set_form_data(this, option, this.edit_data);
    }

    if (this.edit_mode) {
      this.form.removeControl('option');
      this.form.addControl('option', option);
    } else {
      this.form.setControl('option', option);
    }
  }

  before_set_form_data(data: any): void {
    if (data !== null) {
      this.edit_data = data.option;

      this.form.removeControl('option');
      this.form.get('type').setValue(data.type);

      switch (this.form.get('type').value) {
        case ResidentType.FACILITY:
          this.group_id = data.option.bed.room.facility.id;
          break;
        case ResidentType.APARTMENT:
          this.group_id = data.option.bed.room.apartment.id;
          break;
        case ResidentType.REGION:
          this.group_id = data.option.region.id;
          break;
      }
    }
  }

  get_group_data(id: number) {
    let group = null;

    switch (this.form.get('type').value) {
      case ResidentType.FACILITY:
        if (this.facilities) {
          group = this.facilities.filter(v => v.id === id).pop();
        }
        break;
      case ResidentType.REGION:
        if (this.regions) {
          group = this.regions.filter(v => v.id === id).pop();
        }
        break;
      case ResidentType.APARTMENT:
        if (this.apartments) {
          group = this.apartments.filter(v => v.id === id).pop();
        }
        break;
      default:
        break;
    }
    return group;
  }

}
