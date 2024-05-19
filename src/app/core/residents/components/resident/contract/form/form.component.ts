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
import {PaymentPeriod} from '../../../../models/payment-period.enum';
import {State} from '../../../../models/resident-contract';
import {Apartment} from '../../../../models/apartment';
import {Facility} from '../../../../models/facility';
import {Region} from '../../../../models/region';
import {FacilityService} from '../../../../services/facility.service';
import {ApartmentService} from '../../../../services/apartment.service';
import {RegionService} from '../../../../services/region.service';

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

  group_id: any; /** TODO: review **/

  resident_id: number;
  selectedTab: number;

  states: { id: State, name: string }[];
  periods: { id: PaymentPeriod, name: string }[];

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
      end: [new Date(), Validators.required],

      period: [null, Validators.required],

      group_id: [null, Validators.required],
      type: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required],

      option: []
    });

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;
        this.facilities.forEach((v, i) => {
          this.facilities[i]['type'] = ResidentType.FACILITY;
        });
      }
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.apartments = res;
        this.apartments.forEach((v, i) => {
          this.apartments[i]['type'] = ResidentType.APARTMENT;
        });
      }
    });

    this.region$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.regions = res;
        this.regions.forEach((v, i) => {
          this.regions[i]['type'] = ResidentType.REGION;
        });
      }
    });

    this.states = [
      {id: State.ACTIVE, name: 'Active'},
      {id: State.SUSPENDED, name: 'Suspended'},
      {id: State.TERMINATED, name: 'Terminated'}
    ];

    this.periods = [
      {id: PaymentPeriod.HOURLY, name: 'Hourly'},
      {id: PaymentPeriod.DAILY, name: 'Daily'},
      {id: PaymentPeriod.WEEKLY, name: 'Weekly'},
      {id: PaymentPeriod.MONTHLY, name: 'Monthly'},
      {id: PaymentPeriod.YEARLY, name: 'Yearly'},
    ];

    this.selectedTab = 0;
    this.postSubmit = (data: any) => {
      const tab_el = this._el.nativeElement.querySelector(':not(form).ng-invalid').closest('.ant-tabs-tabpane');
      this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
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

          care_group: [null, Validators.required],
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

          care_group: [null, Validators.required],
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

    this.form.get('group_id').setValue(group_id);
    this.form.get('type').setValue(group_type);
    this.form.setControl('option', option);

    console.log(this.form);
  }

}
