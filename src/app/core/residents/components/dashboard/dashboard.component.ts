import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacilityDashboardService} from '../../services/facility-dashboard.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {FacilityService} from '../../services/facility.service';
import {Facility} from '../../models/facility';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {FacilityDashboard} from '../../models/facility-dashboard';
import {DateHelper} from '../../../../shared/helpers/date-helper';

@Component({
  templateUrl: './dashborad.component.html',
  providers: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  FacilityDashboard = FacilityDashboard;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public facilities: Facility[];
  public dashboardData: any;

  public todayDate: Date;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facilityDashboard$: FacilityDashboardService,
    private facility$: FacilityService
  ) {
    this.$subscriptions = {};

    this.todayDate = DateHelper.newDate();
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

            console.log(this.dashboardData);
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
}
