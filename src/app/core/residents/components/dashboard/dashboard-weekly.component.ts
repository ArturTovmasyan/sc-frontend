import * as moment from 'moment';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacilityDashboardService} from '../../services/facility-dashboard.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {KeyValue} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import { FacilityDashboard } from '../../models/facility-dashboard';
import {DateHelper} from '../../../../shared/helpers/date-helper';

@Component({
  templateUrl: './dashborad-weekly.component.html',
  providers: []
})
export class DashboardWeeklyComponent implements OnInit, OnDestroy {
  FacilityDashboard = FacilityDashboard;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;

  public facilityId: number;
  public facilityName: string;
  public dashboardData: any;

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
          if (route_params.has('id') && route_params.has('key')) {
            const date = DateHelper.getDateForKey(route_params.get('key'));
            this.subscribe('list_dashboard', {facility_id: route_params.get('id'), date: date});
          }
        });
        break;
      case 'list_dashboard':
        this.$subscriptions[key] = this.facilityDashboard$.all([
          {key: 'facility_id', value: params.facility_id },
          {key: 'date_from', value: moment(params.date).format('YYYY-MM-DD')},
          {key: 'type', value: '2'}
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
}
