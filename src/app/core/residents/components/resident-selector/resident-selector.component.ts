import {Component, ElementRef, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {Apartment} from '../../models/apartment';
import {Facility} from '../../models/facility';
import {FacilityService} from '../../services/facility.service';
import {ApartmentService} from '../../services/apartment.service';
import {RegionService} from '../../services/region.service';
import {Region} from '../../models/region';
import {Replace} from '../../../../shared/utils/replace.function';

@Component({
  selector: 'app-resident-selector',
  templateUrl: './resident-selector.component.html',
  styleUrls: ['./resident-selector.component.scss']
})
export class ResidentSelectorComponent implements OnInit {
  apartments: Apartment[];
  facilities: Facility[];
  regions: Region[];

  resident_id: number;

  constructor(
    private el: ElementRef,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService
  ) {
    this.resident_id = 1;
  }

  ngOnInit(): void {
    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;
      }
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.apartments = res;
      }
    });

    this.region$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.regions = res;
      }
    });
  }

  groupChanged(value: string): void {
    console.log(value);
  }
}
