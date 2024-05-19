import {Component, ElementRef, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
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
  active_resident_id: number;
  inactive_resident_id: number;

  resident_id: number;

  constructor(
    private el: ElementRef,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private resident$: ResidentService,
    private router$: Router,
    private route$: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.router$.events.subscribe(next => {
      if (next instanceof NavigationEnd) {
        if (this.route$.firstChild) {
          this.route$.firstChild.params.subscribe(params => {
            this.resident_id = +params['id'];
          });
        }
      }
    });
    if (this.route$.firstChild) {
      this.route$.firstChild.params.subscribe(params => {
        this.resident_id = +params['id'];
      });
    }

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
  }

  load_residents_list(value: any): void {
    this.active_residents = [];
    this.active_resident_id = null;
    this.inactive_residents = [];
    this.inactive_resident_id = null;

    const type = value ? value.type : null;
    const type_id = value ? value.id : null;

    if (value != null) {
      this.resident$.list_by_options(true, type, type_id).pipe(first()).subscribe(res => {
        if (res) {
          this.active_residents = res;
          this.active_resident_id = null;
        }
      });
    }

    this.resident$.list_by_options(false, type, type_id).pipe(first()).subscribe(res => {
      if (res) {
        this.inactive_residents = res;
        this.inactive_resident_id = null;
      }
    });
  }

  residentChanged(value: string): void {
    this.resident_id = +value;
    this.router$.navigate(this.routeInfo('responsible-persons'));
  }

  routeInfo(route_name: string) {
    return ['/resident', this.resident_id, {outlets: {'resident-details': [route_name]}}];
  }

}
