import {Component, ElementRef, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {Apartment} from '../../models/apartment';
import {Facility} from '../../models/facility';
import {FacilityService} from '../../services/facility.service';
import {ApartmentService} from '../../services/apartment.service';
import {RegionService} from '../../services/region.service';
import {Region} from '../../models/region';
import {Replace} from '../../../../shared/utils/replace.function';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {DietService} from '../../services/diet.service';
import {Resident} from '../../models/resident';
import {ResidentService} from '../../services/resident.service';

@Component({
  selector: 'app-resident-selector',
  templateUrl: './resident-selector.component.html',
  styleUrls: ['./resident-selector.component.scss']
})
export class ResidentSelectorComponent implements OnInit {
  apartments: Apartment[];
  facilities: Facility[];
  regions: Region[];

  active_residents: Resident[];
  inactive_residents: Resident[];

  group_id: number;
  resident_id: number;

  constructor(
    private el: ElementRef,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private resident$: ResidentService,
    private router$: Router
  ) {
  }

  ngOnInit(): void {
    this.resident_id = 0;

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;
        this.facilities.forEach((v, i) => {
          this.facilities[i]['type'] = 0;
        });
      }
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.apartments = res;
        this.apartments.forEach((v, i) => {
          this.apartments[i]['type'] = 1;
        });
      }
    });

    this.region$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.regions = res;
        this.regions.forEach((v, i) => {
          this.regions[i]['type'] = 2;
        });
      }
    });
  }

  load_residents_list(value: any): void {
    this.resident$.list_by_options(value.id, value.type, 1).pipe(first()).subscribe(res => {
      if (res) {
        this.active_residents = res;
      }
    });
    this.resident$.list_by_options(value.id, value.type, 2).pipe(first()).subscribe(res => {
      if (res) {
        this.inactive_residents = res;
      }
    });
  }

  residentChanged(value: string): void {
    this.resident_id = +value;

    this.router$.navigate(this.routeInfo('medications'));
  }

  routeInfo(route_name: string) {
    return ['/resident', this.resident_id, { outlets: { 'resident-details': [route_name] } }];
  }

}
