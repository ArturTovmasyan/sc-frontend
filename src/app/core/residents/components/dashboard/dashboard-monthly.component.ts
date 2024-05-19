import * as moment from 'moment';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacilityDashboardService} from '../../services/facility-dashboard.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {KeyValue} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {FacilityDashboard} from '../../models/facility-dashboard';
import {DateHelper} from '../../../../shared/helpers/date-helper';

@Component({
  templateUrl: './dashborad-monthly.component.html',
  providers: []
})
export class DashboardMonthlyComponent implements OnInit, OnDestroy {
  FacilityDashboard = FacilityDashboard;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;

  public facilityId: number;
  public facilityName: string;
  public dashboardData: any;

  public currentDate: Date;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facilityDashboard$: FacilityDashboardService,
    private route$: ActivatedRoute
  ) {
    this.$subscriptions = {};
  }

  ngOnInit() {
    this.subscribe('param_id');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'param_id':
        this.$subscriptions[key] = this.route$.paramMap.subscribe(route_params => {
          if (route_params.has('id')) {
            this.getCurrentMonth(parseInt(route_params.get('id'), 10));
          }
        });
        break;
      case 'list_dashboard':
        this.$subscriptions[key] = this.facilityDashboard$.all([
          {key: 'facility_id', value: params.facility_id},
          {key: 'date_from', value: moment(params.from).format('YYYY-MM-DD')},
          {key: 'date_to', value: moment(params.to).format('YYYY-MM-DD')},
          {key: 'type', value: '1'}
        ]).pipe(first()).subscribe(res => {
          if (res) {
            this.dashboardData = res[0];
            this.facilityId = res[0].id;
            this.facilityName = res[0].name;

            this.lineChartLabels = Object.keys(this.dashboardData.data);
            this.lineChartData = [
              {
                label: 'Total Capacity',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].total_capacity)
              },
              {
                label: 'Break Even',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].break_even)
              },
              {
                label: 'Ending Occupancy',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].ending_occupancy)
              },
              {
                label: 'Projected Near Term Occupancy',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].projected_near_term_occupancy)
              } // TODO: review
            ];
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

  public no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
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

  getCurrentMonth(facility_id: number): void {
    const fromDate = DateHelper.getPreviousYear();
    this.currentDate = DateHelper.newDate();

    this.subscribe('list_dashboard', {facility_id: facility_id, from: fromDate, to: this.currentDate});
  }

  getPreviousMonth(): void {
    const today = moment(DateHelper.newDate());
    const fromDate = moment(this.currentDate).subtract(2, 'years').startOf('month').toDate();
    this.currentDate = moment(this.currentDate).subtract(1, 'years').endOf('month').toDate();

    if (today.isSame(this.currentDate, 'month')) {
      this.currentDate = today.toDate();
    }

    this.subscribe('list_dashboard', {facility_id: this.facilityId, from: fromDate, to: this.currentDate});
  }

  getNextMonth(): void {
    const today = moment(DateHelper.newDate());
    const fromDate = moment(this.currentDate).add(1, 'years').endOf('month').toDate();
    this.currentDate = moment(this.currentDate).add(2, 'years').startOf('month').toDate();

    if (today.isSame(this.currentDate, 'month')) {
      this.currentDate = today.toDate();
    }

    this.subscribe('list_dashboard', {facility_id: this.facilityId, from: fromDate, to: this.currentDate});
  }
}
