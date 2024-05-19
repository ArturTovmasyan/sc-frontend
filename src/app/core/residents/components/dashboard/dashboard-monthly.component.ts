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
import {Color} from 'ng2-charts';

@Component({
  templateUrl: './dashborad-monthly.component.html',
  providers: []
})
export class DashboardMonthlyComponent implements OnInit, OnDestroy {
  FacilityDashboard = FacilityDashboard;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;
  public lineChartColors: Color[];

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
            this.lineChartColors = [
              { backgroundColor: 'blue' },
              { backgroundColor: 'yellow' },
              { backgroundColor: 'red' },
              { backgroundColor: 'green' },
              ];
            this.lineChartData = [
              {
                label: 'Beds Target',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].beds_target),
                color: 'green'
              },
              {
                label: 'Yellow Flag',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].yellow_flag)
              },
              {
                label: 'Red Flag',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].red_flag)
              },
              {
                label: 'Ending Occupancy',
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].ending_occupancy)
              }
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
    this.currentDate = moment(DateHelper.newDate())                               .endOf('month').toDate();
    const fromDate   = moment(this.currentDate).subtract(1, 'years').startOf('month').toDate();

    this.subscribe('list_dashboard', {facility_id: facility_id, from: fromDate, to: this.currentDate});
  }

  getPreviousMonth(): void {
    const fromDate = moment(this.currentDate).subtract(2, 'years').startOf('month').toDate();
    const toDate   = moment(this.currentDate).subtract(1, 'years').endOf('month').toDate();

    this.currentDate = toDate;

    this.subscribe('list_dashboard', {facility_id: this.facilityId, from: fromDate, to: toDate});
  }

  getNextMonth(): void {
    const fromDate = moment(this.currentDate).startOf('month').toDate();
    const toDate = moment(this.currentDate).add(1, 'years').endOf('month').toDate();

    this.currentDate = toDate;

    this.subscribe('list_dashboard', {facility_id: this.facilityId, from: fromDate, to: toDate});
  }
}
