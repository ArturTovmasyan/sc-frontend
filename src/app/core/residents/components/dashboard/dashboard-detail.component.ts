import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacilityDashboardService} from '../../services/facility-dashboard.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {KeyValue} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';

@Component({
  templateUrl: './dashborad-detail.component.html',
  providers: []
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;

  public facilityName;
  public dashboardData: any;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facilityDashboard$: FacilityDashboardService
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
        const date = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toJSON();

        this.$subscriptions[key] = this.facilityDashboard$.all([
          {key: 'facility_id', value: '5'},
          {key: 'date_from', value: date}
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

  public no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }
}
