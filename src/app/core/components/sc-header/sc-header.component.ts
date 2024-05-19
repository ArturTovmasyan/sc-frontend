import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from '../../models/user';
import {ProfileService} from '../../services/profile.service';
import {Facility} from '../../residents/models/facility';
import {Apartment} from '../../residents/models/apartment';
import {Region} from '../../residents/models/region';
import {ResidentSelectorService} from '../../residents/services/resident-selector.service';
import {GroupType} from '../../residents/models/group-type.enum';
import {FacilityService} from '../../residents/services/facility.service';
import {ApartmentService} from '../../residents/services/apartment.service';
import {RegionService} from '../../residents/services/region.service';
import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-sc-header',
  templateUrl: './sc-header.component.html'
})
export class ScHeaderComponent implements OnInit, OnDestroy {
  public user: User;
  public facility: Facility;
  public apartment: Apartment;
  public region: Region;

  public show_group: boolean;

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profile$: ProfileService,
    private resident_selector$: ResidentSelectorService,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
  ) {
    this.facility = null;
    this.apartment = null;
    this.region = null;
    this.user = null;
    this.show_group = false;

    this.$subscriptions = {};

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }))
      .pipe(filter((route) => route.outlet === 'primary' || route.outlet === 'resident-details')) // TODO(haykg): review
      .subscribe((route) => {
        console.log(route.routeConfig);
        this.show_group = ['facility/:id', 'apartment/:id', 'region/:id', 'resident/:id'].includes(route.routeConfig.path)
          || route.routeConfig.outlet === 'resident-details';
      });
  }

  ngOnInit(): void {
    this.subscribe('rs_group');
    this.subscribe('get_profile');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any) {
    this.unsubscribe(key);
    switch (key) {
      case 'get_facility':
        this.$subscriptions[key] = this.facility$.get(params.facility_id).subscribe(res => {
          if (res) {
            this.facility = res;
            this.apartment = null;
            this.region = null;
          }
        });
        break;
      case 'get_apartment':
        this.$subscriptions[key] = this.apartment$.get(params.apartment_id).subscribe(res => {
          if (res) {
            this.apartment = res;
            this.facility = null;
            this.region = null;
          }
        });
        break;
      case 'get_region':
        this.$subscriptions[key] = this.region$.get(params.region_id).subscribe(res => {
          if (res) {
            this.region = res;
            this.facility = null;
            this.apartment = null;
          }
        });
        break;
      case 'get_profile':
        this.$subscriptions[key] = this.profile$.me().subscribe(user => {
          this.user = user;
        });
        break;
      case 'rs_group':
        this.$subscriptions[key] = this.resident_selector$.group.subscribe(group => {
          if (group) {
            switch (this.resident_selector$.type.value) {
              case GroupType.FACILITY:
                this.subscribe('get_facility', {facility_id: group});
                break;
              case GroupType.APARTMENT:
                this.subscribe('get_apartment', {apartment_id: group});
                break;
              case GroupType.REGION:
                this.subscribe('get_region', {region_id: group});
                break;
            }
          }
        });
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

}
