import * as moment from 'moment';
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

  public currentDate: Date;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facilityDashboard$: FacilityDashboardService,
    private facility$: FacilityService
  ) {
    this.$subscriptions = {};

    this.currentDate = DateHelper.newDate();
  }

  ngOnInit() {
    this.subscribe('list_facility');

    this.getCurrentMonth();
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_dashboard':
        this.$subscriptions[key] = this.facilityDashboard$
          .all([
            {key: 'date_from', value: moment(params.from).format('YYYY-MM-DD')},
            {key: 'date_to', value: moment(params.to).format('YYYY-MM-DD')}
          ])
          .pipe(first())
          .subscribe(res => {
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

  show(button: string): boolean {
    const today = moment(DateHelper.newDate());
    const current = moment(this.currentDate);

    switch (button) {
      case 'previous':
        return false;
      case 'next':
        return current.isSameOrAfter(today, 'month');
    }
  }

  getCurrentMonth(): void {
    const today = moment(DateHelper.newDate());
    const fromDate = moment(today).startOf('month').toDate();
    this.currentDate = today.toDate();

    this.subscribe('list_dashboard', {from: fromDate, to: this.currentDate});
  }

  getPreviousMonth(): void {
    const today = moment(DateHelper.newDate());
    const fromDate = moment(this.currentDate).subtract(1, 'months').startOf('month').toDate();
    this.currentDate = moment(this.currentDate).subtract(1, 'months').endOf('month').toDate();

    if (today.isSame(this.currentDate, 'month')) {
      this.currentDate = today.toDate();
    }

    this.subscribe('list_dashboard', {from: fromDate, to: this.currentDate});
  }

  getNextMonth(): void {
    const today = moment(DateHelper.newDate());
    const fromDate = moment(this.currentDate).add(1, 'months').startOf('month').toDate();
    this.currentDate = moment(this.currentDate).add(1, 'months').endOf('month').toDate();

    if (today.isSame(this.currentDate, 'month')) {
      this.currentDate = today.toDate();
    }

    this.subscribe('list_dashboard', {from: fromDate, to: this.currentDate});
  }
}
