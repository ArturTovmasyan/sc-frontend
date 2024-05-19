import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../models/space';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {ResidentType} from '../../../models/resident-type.enum';
import {Salutation} from '../../../models/salutation';
import {SalutationService} from '../../../services/salutation.service';
import {CityStateZip} from '../../../models/city-state-zip';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {FacilityDiningRoomService} from '../../../services/facility-dining-room.service';
import {FacilityRoomService} from '../../../services/facility-room.service';
import {ApartmentRoom} from '../../../models/apartment-room';
import {ApartmentRoomService} from '../../../services/apartment-room.service';
import {FacilityDiningRoom} from '../../../models/facility-dining-room';
import {FacilityRoom} from '../../../models/facility-room';
import {State} from '../../../models/resident';
import {Gender} from '../../../models/gender.enum';
import {CareLevel} from '../../../models/care-level';
import {CareLevelService} from '../../../services/care-level.service';
import {PhoneType} from '../../../models/phone-type.enum';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  ResidentType = ResidentType;

  salutations: Salutation[];
  spaces: Space[];

  city_state_zips: CityStateZip[];
  care_levels: CareLevel[];
  dining_rooms: FacilityDiningRoom[];
  facility_rooms: FacilityRoom[];
  apartment_rooms: ApartmentRoom[];

  private _type: ResidentType;
  private _group_id: number;

  states: { id: State, name: string }[];
  genders: { id: Gender, name: string }[];

  phone_types: { id: PhoneType, name: string }[];

  selectedTab: number = 0;

  @ViewChild('photo_file') photo_file: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private dining_room$: FacilityDiningRoomService,
    private facility_room$: FacilityRoomService,
    private apartment_room$: ApartmentRoomService,
    private care_level$: CareLevelService,
    private city_state_zip$: CityStateZipService,
    private salutation$: SalutationService,
    private space$: SpaceService
  ) {
    super();
  }

  get type(): ResidentType {
    return this._type;
  }

  set type(value: ResidentType) {
    this._type = value;
  }

  get group_id(): number {
    return this._group_id;
  }

  set group_id(value: number) {
    this._group_id = value;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      birthday: [new Date(), Validators.required],
      gender: [null, Validators.required],
      photo: [null, Validators.required],

      type: [this._type, Validators.required],

      salutation_id: [null, Validators.required],
      space_id: [null, Validators.required],

      phones: this.formBuilder.array([]),

      option: []
    });

    this.salutation$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.salutations = res;
      }
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });

    this.states = [
      {id: State.ACTIVE, name: 'Active'},
      {id: State.INACTIVE, name: 'Inactive'},
    ];

    this.genders = [
      {id: Gender.MALE, name: 'Male'},
      {id: Gender.FEMALE, name: 'Female'},
    ];

    this.phone_types = [
      {id: PhoneType.HOME, name: 'HOME'},
      {id: PhoneType.MOBILE, name: 'MOBILE'},
      {id: PhoneType.WORK, name: 'WORK'},
      {id: PhoneType.OFFICE, name: 'OFFICE'},
      {id: PhoneType.EMERGENCY, name: 'EMERGENCY'},
      {id: PhoneType.FAX, name: 'FAX'},
      {id: PhoneType.ROOM, name: 'ROOM'}
    ];
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'phones':
        return this.formBuilder.group({
          id: [null],
          type: [null, Validators.required],
          number: ['', Validators.required],
          primary: [false],
          sms_enabled: [false],
          compatibility: [null]
        });
      default:
        return null;
    }
  }


  public init_subform(): void {
    let option = this.formBuilder.group({});

    switch (this._type) {
      case ResidentType.FACILITY:
        option = this.formBuilder.group({
          date_admitted: [new Date(), Validators.required],
          state: [null, Validators.required],

          care_group: [null, Validators.required],
          care_level_id: [null, Validators.required],
          ambulatory: [false, Validators.required],
          dnr: [false, Validators.required],
          polst: [false, Validators.required],

          room_id: [null, Validators.required],
          dining_room_id: [null, Validators.required],
        });
        this.facility_room$.all(/** by goup_id **/).pipe(first()).subscribe(res => {
          if (res) {
            this.facility_rooms = res;
          }
        });
        this.dining_room$.all(/** by goup_id **/).pipe(first()).subscribe(res => {
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
          date_admitted: [new Date(), Validators.required],
          state: [null, Validators.required],

          room_id: [null, Validators.required],
        });
        this.apartment_room$.all(/** by goup_id **/).pipe(first()).subscribe(res => {
          if (res) {
            this.apartment_rooms = res;
          }
        });
        break;
      case ResidentType.REGION:
        option = this.formBuilder.group({
          date_admitted: [new Date(), Validators.required],
          state: [null, Validators.required],

          care_group: [null, Validators.required],
          care_level_id: [null, Validators.required],
          ambulatory: [false, Validators.required],
          dnr: [false, Validators.required],
          polst: [false, Validators.required],

          street_address: ['', Validators.required],
          csz_id: [null, Validators.required],
          region_id: [null, Validators.required],
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

    this.form.setControl('option', option);
  }

  onFileChange($event) {
    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length > 0) {
      const file = $event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('photo').setValue(reader.result);
      };
    }

    return false;
  }

  select_file() {
    (this.photo_file.nativeElement as HTMLInputElement).click();
  }
}
