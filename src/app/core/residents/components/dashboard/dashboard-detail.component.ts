import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacilityDashboardService} from '../../services/facility-dashboard.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {KeyValue} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import { FacilityDashboard } from '../../models/facility-dashboard';

@Component({
  templateUrl: './dashborad-detail.component.html',
  providers: []
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  FacilityDashboard = FacilityDashboard;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;

  public facilityName;
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
          if (route_params.has('id')) {
            const date = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toJSON();
            this.subscribe('list_dashboard', {facility_id: route_params.get('id'), date: date});
          }
        });
        break;
      case 'list_dashboard':
        this.$subscriptions[key] = this.facilityDashboard$.all([
          {key: 'facility_id', value: params.facility_id },
          {key: 'date_from', value: params.date}
        ]).pipe(first()).subscribe(res => {
          if (res) {
            this.dashboardData = res[0];
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
                data: this.lineChartLabels.map(dkey => this.dashboardData.data[dkey].capacity_yellow)
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
