import * as moment from 'moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../../guards/auth.guard';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ResidentService} from '../../../services/resident.service';
import {ResidentEventService} from '../../../services/resident-event.service';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {AdmissionTypePipe} from '../../../pipes/admission-type.pipe';
import {PaymentPeriodPipe} from '../../../pipes/payment-period.pipe';
import {RentIncreaseReasonPipe} from '../../../pipes/rent-increase-reason.pipe';
import {AdmissionType} from '../../../models/resident-admission';
import {FormComponent} from '../event/form/form.component';
import {CalendarEventType} from '../../../models/event-definition';

@Component({
  templateUrl: './calendar.component.html',
  providers: []
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarPlugins = [dayGridPlugin, listPlugin, bootstrapPlugin]; // important!
  calendarCustomButtons = {
    add_event: {
      text: 'Add Event',
      click: () => this.show_modal_add()
    }
  };

  calendarHeader = {left: 'prev,next today add_event', center: 'title', right: 'dayGridMonth,dayGridWeek,dayGridDay,listMonth'};
  calendarTimeFormat = {hour: '2-digit', minute: '2-digit', second: '2-digit', meridiem: false};
  calendarEvents = [];

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private resident$: ResidentService,
    private residentEvent$: ResidentEventService,
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
                event_type: CalendarEventType.ADMISSION,
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
                event_type: CalendarEventType.RENT,
                start: moment(rent.start).format('YYYY-MM-DD'),
                end: rent.end ? moment(rent.end).format('YYYY-MM-DD') : null,
                title: (new PaymentPeriodPipe()).transform(rent.period)
              });
            });

            res.facility_events.forEach(event => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#1e75d7',
                textColor: '#ffffff',
                id: event.id,
                event_type: CalendarEventType.FACILITY,
                start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
                end: event.end ? moment(event.end).format('YYYY-MM-DD HH:mm:ss') : null,
                title: event.title
              });
            });

            res.resident_events.forEach(event => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#d7255d',
                textColor: '#ffffff',
                id: event.id,
                event_type: CalendarEventType.RESIDENT,
                start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
                end: event.end ? moment(event.end).format('YYYY-MM-DD HH:mm:ss') : null,
                title: event.title
              });
            });

            res.rent_increases.forEach(rent_increase => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#603e95',
                textColor: '#ffffff',
                id: rent_increase.id,
                event_type: CalendarEventType.RENT_INCREASE,
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

  show_modal_add(): void {
    this.create_modal(FormComponent, data => this.residentEvent$.add(data), null);
  }

  show_modal_edit(id: number): void {
    this.residentEvent$.get(id).pipe(first()).subscribe(res => {
      if (res) {
        this.create_modal(FormComponent, data => this.residentEvent$.edit(data), res);
      }
    });
  }

  private create_modal(form_component: any, submit: (data: any) => Observable<any>, result: any) {
    let valid = false;
    let loading = false;

    const footer = [
      {
        label: 'Cancel',
        onClick: () => {
          modal.close();
        }
      },
      {
        type: 'primary',
        label: 'Save',
        loading: () => loading,
        disabled: () => !valid,
        onClick: () => {
          loading = true;

          const component = <AbstractForm>modal.getContentComponent();
          component.before_submit();
          const form_data = component.formObject.value;

          component.submitted = true;

          submit(form_data).subscribe(
            res => {
              loading = false;

              this.subscribe('rs_resident');

              modal.close();
            },
            error => {
              loading = false;

              component.handleSubmitError(error);
              component.postSubmit(null);
              // console.error(error);
            });
        }
      },
    ];

    if (result === null) {
      footer.push({
        type: 'primary',
        label: 'Save & Add',
        loading: () => loading,
        disabled: () => !valid,
        onClick: () => {
          loading = true;

          const component = <AbstractForm>modal.getContentComponent();
          component.before_submit();
          const form_data = component.formObject.value;

          component.submitted = true;

          submit(form_data).subscribe(
            res => {
              loading = false;

              this.subscribe('rs_resident');

              modal.close();

              this.create_modal(form_component, submit, result);
            },
            error => {
              loading = false;

              component.handleSubmitError(error);
              component.postSubmit(null);
              // console.error(error);
            });
        }
      });
    }

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: form_component,
      nzFooter: footer
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof FormComponent) {
        const form = component.formObject;

        if (result !== null) {
          component.loaded.subscribe(v => {
            if (v) {
              component.before_set_form_data(result);
              component.set_form_data(component, form, result);
              component.after_set_form_data();
            }
          });
        }

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

  eventMouseEnter($event: any) {
    if ($event.event.extendedProps.event_type === CalendarEventType.RESIDENT) {
      this.show_modal_edit($event.event.id);
    }
  }
}
