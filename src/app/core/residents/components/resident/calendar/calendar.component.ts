import {Component, OnDestroy, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {AuthGuard} from '../../../../guards/auth.guard';
import {ResidentService} from '../../../services/resident.service';
import {first} from 'rxjs/operators';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {AdmissionTypePipe} from '../../../pipes/admission-type.pipe';
import {PaymentPeriodPipe} from '../../../pipes/payment-period.pipe';
import {RentIncreaseReasonPipe} from '../../../pipes/rent-increase-reason.pipe';
import * as moment from 'moment';
import {AdmissionType} from '../../../models/resident-admission';

@Component({
  templateUrl: './calendar.component.html',
  providers: []
})
export class CalendarComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  calendarPlugins = [dayGridPlugin, listPlugin, bootstrapPlugin]; // important!
  calendarEvents = [];

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private resident$: ResidentService,
    private residentSelector$: ResidentSelectorService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.subscribe('list_calendar', {resident_id: next});
          }
        });
        break;
      case 'list_calendar':
        this.$subscriptions[key] = this.resident$.calendar(params.resident_id, null, null).pipe(first()).subscribe(res => {
          if (res) {
            this.calendarEvents = [];

            res.admissions.forEach(admission => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#fac22b',
                textColor: '#ffffff',
                id: admission.id,
                start: moment(admission.start).format('YYYY-MM-DD'),
                end: this.formatAdmissionEnd(admission),
                title: (new AdmissionTypePipe()).transform(admission.admission_type)
              });
            });

            res.rents.forEach(rent => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#009da1',
                textColor: '#ffffff',
                id: rent.id,
                start: moment(rent.start).format('YYYY-MM-DD'),
                end: rent.end ? moment(rent.end).format('YYYY-MM-DD') : null,
                title: (new PaymentPeriodPipe()).transform(rent.period)
              });
            });

            res.events.forEach(event => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#d7255d',
                textColor: '#ffffff',
                id: event.id,
                start: moment(event.start).format('YYYY-MM-DD'),
                end: event.end ? moment(event.end).format('YYYY-MM-DD') : null,
                title: event.title
              });
            });

            res.rent_increases.forEach(rent_increase => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#603e95',
                textColor: '#ffffff',
                id: rent_increase.id,
                start: moment(rent_increase.start).format('YYYY-MM-DD'),
                end: rent_increase.end ? moment(rent_increase.end).format('YYYY-MM-DD') : null,
                title: (new RentIncreaseReasonPipe()).transform(rent_increase.reason)
              });
            });
          }
        });
        break;
      default:
        break;
    }
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }

  formatAdmissionEnd(admission: any) {
    if (admission.end === null) {
      if (admission.admission_type === AdmissionType.DISCHARGE) {
        return null;
      } else {
        return moment(new Date()).format('YYYY-MM-DD');
      }
    } else {
      return moment(admission.end).format('YYYY-MM-DD');
    }

  }
}
