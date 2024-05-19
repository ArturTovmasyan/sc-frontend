import * as moment from 'moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../../guards/auth.guard';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../services/facility.service';
import {FacilityEventService} from '../../../services/facility-event.service';
import {PaymentPeriodPipe} from '../../../pipes/payment-period.pipe';
import {RentIncreaseReasonPipe} from '../../../pipes/rent-increase-reason.pipe';
import {AdmissionType} from '../../../models/resident-admission';
import {FormComponent} from '../event-form/form.component';
import {CalendarEventType, EventDefinition} from '../../../models/event-definition';
import {AdmissionTypePipe} from '../../../pipes/admission-type.pipe';
import {EventDefinitionService} from '../../../services/event-definition.service';
import {ViewComponent as ResidentEventViewComponent} from '../../resident/event/view/view.component';
import {ResidentEventService} from '../../../services/resident-event.service';

@Component({
  selector: 'app-facility-calendar',
  templateUrl: './calendar.component.html',
  providers: []
})
export class CalendarComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  @Input() facility_id: number;

  calendarPlugins = [dayGridPlugin, listPlugin, bootstrapPlugin]; // important!
  calendarCustomButtons = {
    add_event: {
      text: 'Add Event',
      click: () => this.show_modal_add()
    }
  };

  calendarHeader = {left: 'prev,next today add_event', center: 'title', right: 'dayGridMonth,dayGridWeek,dayGridDay,listMonth'};
  calendarTimeFormat = {hour: 'numeric', minute: '2-digit', meridiem: 'narrow'};
  calendarEvents = [];

  event_definitions: EventDefinition[];

  definition_id: number = null;
  show_resident: boolean = true;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private facility$: FacilityService,
    private facilityEvent$: FacilityEventService,
    private residentEvent$: ResidentEventService,
    private eventDefinition$: EventDefinitionService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('list_event_definition');
    this.subscribe('list_calendar', {definition_id: null, show_resident: true});
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
      case 'list_event_definition':
        this.$subscriptions[key] = this.eventDefinition$
          .all([{key: 'view', value: CalendarEventType.RESIDENT.toString()}]).pipe(first()).subscribe(res => {
            if (res) {
              this.event_definitions = res;
            }
          });
        break;
      case 'list_calendar':
        this.$subscriptions[key] = this.facility$
          .calendar(this.facility_id, params.definition_id, null, null).pipe(first()).subscribe(res => {
            if (res) {
              this.calendarEvents = [];

              res.facility_events.forEach(event => {
                this.calendarEvents.push({
                  borderColor: 'transparent',
                  backgroundColor: event.rsvp === false ? '#5d99d7' : '#1e75d7',
                  textColor: '#ffffff',
                  id: event.id,
                  event_type: CalendarEventType.FACILITY,
                  start: moment.utc(event.start).format('YYYY-MM-DD HH:mm:ss'),
                  end: event.end ? moment.utc(event.end).format('YYYY-MM-DD HH:mm:ss') : null,
                  title: event.title
                });
              });

              if (params.show_resident) {
                res.resident_events.forEach(event => {
                  this.calendarEvents.push({
                    borderColor: 'transparent',
                    backgroundColor: '#d7255d',
                    textColor: '#ffffff',
                    id: event.id,
                    event_type: CalendarEventType.RESIDENT,
                    start: moment.utc(event.start).format('YYYY-MM-DD HH:mm:ss'),
                    end: event.end ? moment.utc(event.end).format('YYYY-MM-DD HH:mm:ss') : null,
                    title: this.formatResident(CalendarEventType.RESIDENT, event),
                  });
                });

                res.rents.forEach(rent => {
                  this.calendarEvents.push({
                    borderColor: 'transparent',
                    backgroundColor: '#009da1',
                    textColor: '#ffffff',
                    id: rent.id,
                    event_type: CalendarEventType.RENT,
                    start: moment.utc(rent.start).format('YYYY-MM-DD'),
                    end: rent.end ? moment.utc(rent.end).format('YYYY-MM-DD') : null,
                    title: this.formatResident(CalendarEventType.RENT, rent)
                  });
                });

                res.rent_increases.forEach(rent_increase => {
                  this.calendarEvents.push({
                    borderColor: 'transparent',
                    backgroundColor: '#603e95',
                    textColor: '#ffffff',
                    id: rent_increase.id,
                    event_type: CalendarEventType.RENT_INCREASE,
                    start: moment.utc(rent_increase.start).format('YYYY-MM-DD'),
                    end: rent_increase.end ? moment.utc(rent_increase.end).format('YYYY-MM-DD') : null,
                    title: this.formatResident(CalendarEventType.RENT_INCREASE, rent_increase),
                  });
                });
              }
            }
          });
        break;
      default:
        break;
    }
  }

  private formatResident(type: CalendarEventType, event: any): string {
    let subValue: string = '';
    switch (type) {
      case CalendarEventType.RESIDENT:
        subValue = event.title;
        break;
      case CalendarEventType.ADMISSION:
        subValue = (new AdmissionTypePipe()).transform(event.admission_type);
        break;
      case CalendarEventType.RENT:
        subValue = (new PaymentPeriodPipe()).transform(event.period);
        break;
      case CalendarEventType.RENT_INCREASE:
        subValue = (new RentIncreaseReasonPipe()).transform(event.reason);
        break;
    }

    return `${event.room_number} (${event.bed_number}) ${event.first_name} ${event.last_name} - ${subValue}`;
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
    this.create_modal(FormComponent, data => this.facilityEvent$.add(data), null);
  }

  show_modal_edit(id: number): void {
    this.facilityEvent$.get(id).pipe(first()).subscribe(res => {
      if (res) {
        this.create_modal(FormComponent, data => this.facilityEvent$.edit(data), res);
      }
    });
  }

  show_modal_view(id: number): void {
    this.residentEvent$.get(id).pipe(first()).subscribe(res => {
      if (res) {
        this.create_modal_view(ResidentEventViewComponent, res);
      }
    });
  }

  private create_modal_view(form_component: any, result: any) {
    const footer = [
      {
        label: 'Close',
        onClick: () => {
          modal.close();
        }
      },
    ];

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
      if (component instanceof ResidentEventViewComponent) {
        component.event = result;
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

              this.subscribe('list_calendar');

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

              this.subscribe('list_calendar');

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

        form.get('facility_id').setValue(this.facility_id);

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
    switch ($event.event.extendedProps.event_type) {
      case CalendarEventType.FACILITY:
        this.show_modal_edit($event.event.id);
        break;
      case CalendarEventType.RESIDENT:
        this.show_modal_view($event.event.id);
        break;
      default:
        break;
    }
  }

  type_change($event: any) {
    this.subscribe('list_calendar', {definition_id: this.definition_id, show_resident: this.show_resident});
  }
}
