import * as moment from 'moment';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {LeadService} from '../../../../leads/services/lead.service';
import {FacilityService} from '../../../services/facility.service';
import {FacilityRoomTypeService} from '../../../services/facility-room-type.service';

@Component({
  templateUrl: './room-summary.component.html',
  providers: []
})
export class RoomSummaryComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  public facilityId: number;
  public facilityName: string;
  public dashboardData: any;

  public total = null;

  public currentDate: Date;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facility$: FacilityService,
    private service$: FacilityRoomTypeService,
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
            const id = parseInt(route_params.get('id'), 10);
            const date = DateHelper.getDateForKey(route_params.get('key'));

            this.getCurrentMonth(id, date);
            this.subscribe('get_facility', {facility_id: id});
          }
        });
        break;
      case 'get_facility':
        this.$subscriptions[key] = this.facility$.get(params.facility_id).subscribe(res => {
          if (res) {
            this.facilityId = res.id;
            this.facilityName = res.name;
          }
        });
        break;
      case 'list_dashboard':
        this.$subscriptions[key] = this.service$.all([
          {key: 'facility_id', value: params.facility_id},
          {key: 'date_from', value: moment(params.from).format('YYYY-MM-DD')},
          {key: 'date_to', value: moment(params.to).format('YYYY-MM-DD')}
        ]).pipe(first()).subscribe(res => {
          if (res) {
            this.dashboardData = res;

            this.total = this.dashboardData.reduce((total, val) => total + val.count_rooms, 0);
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

  getCurrentMonth(facility_id: number, date?: Date): void {
    this.currentDate = date ? date : DateHelper.newDate();

    const fromDate = moment(this.currentDate).startOf('month').toDate();
    const toDate = moment(this.currentDate).endOf('month').toDate();

    this.currentDate = fromDate;

    this.subscribe('list_dashboard', {facility_id: facility_id, from: fromDate, to: toDate});
  }

  getPreviousMonth(): void {
    const fromDate = moment(this.currentDate).subtract(1, 'month').startOf('month').toDate();
    const toDate = moment(this.currentDate).subtract(1, 'month').endOf('month').toDate();

    this.currentDate = fromDate;

    this.subscribe('list_dashboard', {facility_id: this.facilityId, from: fromDate, to: toDate});
  }

  getNextMonth(): void {
    const fromDate = moment(this.currentDate).add(1, 'month').startOf('month').toDate();
    const toDate = moment(this.currentDate).add(1, 'month').endOf('month').toDate();

    this.currentDate = fromDate;

    this.subscribe('list_dashboard', {facility_id: this.facilityId, from: fromDate, to: toDate});
  }
}
