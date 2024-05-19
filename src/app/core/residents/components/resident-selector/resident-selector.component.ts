import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {first, debounceTime, throttleTime} from 'rxjs/operators';
import {Apartment} from '../../models/apartment';
import {Facility} from '../../models/facility';
import {FacilityService} from '../../services/facility.service';
import {ApartmentService} from '../../services/apartment.service';
import {RegionService} from '../../services/region.service';
import {Region} from '../../models/region';
import {Resident} from '../../models/resident';
import {ResidentService} from '../../services/resident.service';
import {ResidentType} from '../../models/resident-type.enum';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ResidentSelectorService} from '../../services/resident-selector.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-resident-selector',
  templateUrl: './resident-selector.component.html',
  styleUrls: ['./resident-selector.component.scss']
})
export class ResidentSelectorComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  public apartments: Apartment[];
  public facilities: Facility[];
  public regions: Region[];

  public active_residents: Resident[];
  public inactive_residents: Resident[];

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private resident$: ResidentService,
    private router$: Router,
    private route$: ActivatedRoute,
    public residentSelector$: ResidentSelectorService
  ) {

    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      group: [null],
      active_resident_id: [null],
      inactive_resident_id: [null]
    });

    this.$subscriptions['vc_group'] = this.form.get('group').valueChanges.subscribe(next => {
      console.log(next);
      if (next) {
        this.residentSelector$.type.next(next.type);
        this.residentSelector$.group.next(next.id);
      } else {
        this.resident$.list_by_options(false, null, null).pipe(first()).subscribe(res => {
          if (res) {
            this.inactive_residents = res;
            this.residentSelector$.resident.next(this.residentSelector$.resident.value);
          }
        });
      }
    });

    this.$subscriptions['vc_active_resident_id'] = this.form.get('active_resident_id').valueChanges.subscribe(next => {
      if (next) {
        this.residentSelector$.resident.next(next);
        this.router$.navigate(this.routeInfo('responsible-persons'));
      }
    });

    this.$subscriptions['vc_inactive_resident_id'] = this.form.get('inactive_resident_id').valueChanges.subscribe(next => {
      if (next) {
        this.residentSelector$.resident.next(next);
        this.router$.navigate(this.routeInfo('responsible-persons'));
      }
    });

    this.$subscriptions['rs_group'] = this.residentSelector$.group.pipe(throttleTime(200)).subscribe(next => {
      this.active_residents = [];
      this.inactive_residents = [];
      this.form.get('active_resident_id').setValue(null);
      this.form.get('inactive_resident_id').setValue(null);

      if (next) {
        this.$subscriptions['vc_group'].unsubscribe();
        this.form.get('group').setValue(this.get_group_data(next));
        this.$subscriptions['vc_group'] = this.form.get('group').valueChanges.subscribe(next_ => {
          console.log(next_);
          if (next_) {
            this.residentSelector$.type.next(next_.type);
            this.residentSelector$.group.next(next_.id);
          } else {
            this.resident$.list_by_options(false, null, null).pipe(first()).subscribe(res => {
              if (res) {
                this.inactive_residents = res;
                this.residentSelector$.resident.next(this.residentSelector$.resident.value);
              }
            });
          }
        });

        this.resident$
          .list_by_options(true, this.residentSelector$.type.value, this.residentSelector$.group.value)
          .pipe(first()).subscribe(res => {
          if (res) {
            this.active_residents = res;
            this.residentSelector$.resident.next(this.residentSelector$.resident.value);
          }
        });

        this.resident$
          .list_by_options(false, this.residentSelector$.type.value, this.residentSelector$.group.value)
          .pipe(first()).subscribe(res => {
          if (res) {
            this.inactive_residents = res;
            this.residentSelector$.resident.next(this.residentSelector$.resident.value);
          }
        });
      }
    });

    this.$subscriptions['rs_resident'] = this.residentSelector$.resident.subscribe(next => {
      if (next) {
        this.$subscriptions['vc_active_resident_id'].unsubscribe();
        this.$subscriptions['vc_inactive_resident_id'].unsubscribe();

        this.form.get('active_resident_id').setValue(next);
        this.form.get('inactive_resident_id').setValue(next);

        this.$subscriptions['vc_active_resident_id'] = this.form.get('active_resident_id').valueChanges.subscribe(next => {
          if (next) {
            this.residentSelector$.resident.next(next);
            this.router$.navigate(this.routeInfo('responsible-persons'));
          }
        });
        this.$subscriptions['vc_inactive_resident_id'] = this.form.get('inactive_resident_id').valueChanges.subscribe(next => {
          if (next) {
            this.residentSelector$.resident.next(next);
            this.router$.navigate(this.routeInfo('responsible-persons'));
          }
        });
      }
    });

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;
        this.facilities.forEach((v, i) => {
          this.facilities[i]['type'] = ResidentType.FACILITY;
        });

        this.residentSelector$.group.next(this.residentSelector$.group.value);
      }
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.apartments = res;
        this.apartments.forEach((v, i) => {
          this.apartments[i]['type'] = ResidentType.APARTMENT;
        });

        this.residentSelector$.group.next(this.residentSelector$.group.value);
      }
    });

    this.region$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.regions = res;
        this.regions.forEach((v, i) => {
          this.regions[i]['type'] = ResidentType.REGION;
        });

        this.residentSelector$.group.next(this.residentSelector$.group.value);
      }
    });
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  routeInfo(route_name: string) {
    const resident_id = this.residentSelector$.resident.value;

    return ['/resident', resident_id, {outlets: {'resident-details': [route_name]}}];
  }

  get_group_data(id: number) {
    let group = null;

    switch (this.residentSelector$.type.value) {
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
