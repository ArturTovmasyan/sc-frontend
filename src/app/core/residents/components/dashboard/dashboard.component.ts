import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacilityDashboardService} from '../../services/facility-dashboard.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {FacilityService} from '../../services/facility.service';
import {Facility} from '../../models/facility';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  templateUrl: './dashborad.component.html',
  providers: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public facilities: Facility[];
  public dashboardData: any;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facilityDashboard$: FacilityDashboardService,
    private facility$: FacilityService
  ) {
    this.$subscriptions = {};
  }

  ngOnInit() {
    this.subscribe('list_facility');
    this.subscribe('list_dashboard');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_dashboard':
        this.$subscriptions[key] = this.facilityDashboard$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.dashboardData = {};
            res.forEach(value => {
              const vkey = Object.keys(value.data)[0];
              value.data = value.data[vkey];
              this.dashboardData[value.id] = value;
            });
          }
        });
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;
          }
        });
        break;
      default:
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  getEndingStyle(data: any) {
    let style = {};

    if (data.ending_occupancy > data.capacity_yellow) {
      style = {'background-color': '#a2ddb7'};
    } else if (data.ending_occupancy > data.break_even && data.ending_occupancy <= data.capacity_yellow) {
      style = {'background-color': '#ffdf7e'};
    } else if (data.ending_occupancy <= data.break_even) {
      style = {'background-color': '#ed969e', 'color': 'white', 'font-weight': 'bold'};
    }

    return style;
  }
}
