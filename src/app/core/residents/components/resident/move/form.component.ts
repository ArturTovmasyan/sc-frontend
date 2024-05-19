import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../services/facility.service';
import {Facility} from '../../../models/facility';
import {FacilityBed, FacilityRoom} from '../../../models/facility-room';
import {FacilityRoomService} from '../../../services/facility-room.service';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';
import {Apartment} from '../../../models/apartment';
import {Region} from '../../../models/region';
import {ApartmentBed, ApartmentRoom} from '../../../models/apartment-room';
import {ApartmentService} from '../../../services/apartment.service';
import {RegionService} from '../../../services/region.service';
import {GroupType} from '../../../models/group-type.enum';
import {ApartmentRoomService} from '../../../services/apartment-room.service';
import {GridService} from '../../../../../shared/services/grid.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  apartments: Apartment[];
  facilities: Facility[];
  regions: Region[];

  rooms: (FacilityRoom | ApartmentRoom)[];

  private _resident: Resident;

  private _show_group: boolean = false;
  private _show_bed: boolean = false;

  private _current_room: { id: number, number: string, beds: ApartmentBed[]|FacilityBed[] };

  constructor(
    private formBuilder: FormBuilder,
    private resident$: ResidentService,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private facility_room$: FacilityRoomService,
    private apartment_room$: ApartmentRoomService
  ) {
    super();
  }

  get resident(): Resident {
    return this._resident;
  }

  set resident(value: Resident) {
    this._resident = value;
  }

  get current_room(): { id: number, number: string, beds: ApartmentBed[]|FacilityBed[] } {
    return this._current_room;
  }

  set current_room(value: { id: number, number: string, beds: ApartmentBed[]|FacilityBed[] }) {
    this._current_room = value;
  }

  get show_group(): boolean {
    return this._show_group;
  }

  set show_group(value: boolean) {
    this._show_group = value;
  }

  get show_bed(): boolean {
    return this._show_bed;
  }

  set show_bed(value: boolean) {
    this._show_bed = value;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null, Validators.required],

      group: [null, Validators.required],
      group_id: [null, Validators.required],
      group_type: [null, Validators.required],

      bed_id: [null, Validators.required],
    });

    this.form.get('group').valueChanges.subscribe(next => {
      if (next) {
        this.form.get('group_id').setValue(next.id);
        this.form.get('group_type').setValue(next.type);

        this.populate_rooms();
      }
    });
  }

  after_set_form_data(): void {
    if (this._show_group) {
      this.facility$.all().pipe(first()).subscribe(res => {
        if (res) {
          this.facilities = res;
          this.facilities.forEach((v, i) => {
            this.facilities[i]['type'] = GroupType.FACILITY;
          });

          if (this.form.get('group').value === null) {
            this.form.get('group').setValue(this.facilities[0]);
          }
        }
      });

      this.apartment$.all().pipe(first()).subscribe(res => {
        if (res) {
          this.apartments = res;
          this.apartments.forEach((v, i) => {
            this.apartments[i]['type'] = GroupType.APARTMENT;
          });
        }
      });

      this.region$.all().pipe(first()).subscribe(res => {
        if (res) {
          this.regions = res;
          this.regions.forEach((v, i) => {
            this.regions[i]['type'] = GroupType.REGION;
          });
        }
      });
    }

    this.populate_rooms();
  }

  private populate_rooms() {
    const group_type = this.form.get('group_type').value;
    const group_id = this.form.get('group_id').value;

    this.form.get('bed_id').reset(null);
    this.rooms = [];

    let service: any; // FacilityRoomService|ApartmentRoomService
    let key: string;

    switch (group_type) {
      case GroupType.FACILITY:
        service = this.facility_room$;
        key = 'facility_id';
        this._show_bed = true;
        this.form.get('bed_id').enable();
        break;
      case GroupType.APARTMENT:
        service = this.apartment_room$;
        key = 'apartment_id';
        this._show_bed = true;
        this.form.get('bed_id').enable();
        break;
      case GroupType.REGION:
        service = null;
        key = null;
        this._show_bed = false;
        this.form.get('bed_id').disable();
        break;
    }

    if (service) {
      service.all([{key: key, value: group_id}, {key: 'vacant', value: true}]).pipe(first()).subscribe(res => {
        if (res) {
          let rooms = res;

          rooms.forEach((room, i) => {
            if (this.current_room && room.id === this.current_room.id) {
              rooms[i].beds = this.current_room.beds;
            }

            rooms[i].beds = room.beds.filter(bed => bed.resident == null);
          });

          rooms = rooms.filter(room => room.beds.length > 0);

          this.rooms = rooms;
        }
      });
    }
  }
}
