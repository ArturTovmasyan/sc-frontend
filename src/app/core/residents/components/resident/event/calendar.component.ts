import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin, {ListView} from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {CurrencyPipe} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../../guards/auth.guard';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {AdmissionTypePipe} from '../../../pipes/admission-type.pipe';
import {CalendarEventType} from '../../../models/event-definition';
import {FacilityEventService} from '../../../services/facility-event.service';
import {ResidentService} from '../../../services/resident.service';
import {ResidentEventService} from '../../../services/resident-event.service';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {ResidentRentIncreaseService} from '../../../services/resident-rent-increase.service';
import {ResidentAwayDaysService} from '../../../services/resident-away-days.service';
import {ResidentRentService} from '../../../services/resident-rent.service';
import {FormComponent} from './form/form.component';
import {FormComponent as MonthPickerFormComponent} from '../../../../../shared/components/month-picker-form/form.component';
import {FormComponent as FacilityEventFormComponent} from '../../facility/event-form/form.component';
import {ViewComponent as FacilityEventViewComponent} from '../../facility/event-form/view.component';
import {ViewComponent as ResidentEventViewComponent} from './view/view.component';
import {ViewComponent as ResidentRentViewComponent} from '../rent/rent/view/view.component';
import {ViewComponent as ResidentRentIncreaseViewComponent} from '../rent/rent-increase/view/view.component';
import {ViewComponent as ResidentAwayDaysViewComponent} from '../ledger/ledger/away-days/view/view.component';

@Component({
  selector: 'app-resident-calendar',
  templateUrl: './calendar.component.html',
  providers: []
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar', {static: false}) calendarComponent: FullCalendarComponent;

  calendarLastView: any;
  calendarPlugins = [dayGridPlugin, listPlugin, bootstrapPlugin]; // important!
  calendarCustomButtons = {
    add_event: {
      text: 'Add Event',
      click: () => this.show_modal_add()
    },
    choose: {
      text: 'picker',
      click: () => {
        this.create_modal(MonthPickerFormComponent, data => {
          this.calendarComponent.getApi().gotoDate(DateHelper.formatMoment(data.date, 'YYYY-MM-DD'));
          return new BehaviorSubject<boolean>(false);
        }, true);
      }
    }
  };

  calendarHeader = {left: 'prev,next today add_event', center: 'title', right: 'choose,dayGridMonth,dayGridWeek,dayGridDay,listAll'};
  calendarTimeFormat = {hour: 'numeric', minute: '2-digit', meridiem: 'narrow'};
  calendarViews = {
    listAll: {
      type: 'list',
      visibleRange: (currentDate) => {
        const eventDates = this.calendarEvents.map(v => new Date(v.start));
        const startDate = eventDates.reduce((a, b) => a < b ? a : b);
        const endDate = eventDates.reduce((a, b) => a > b ? a : b);

        return {start: startDate, end: endDate};
      },
      buttonText: 'list'
    }
  };
  calendarEvents = [];

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private resident$: ResidentService,
    private residentEvent$: ResidentEventService,
    private residentRent$: ResidentRentService,
    private residentRentIncrease$: ResidentRentIncreaseService,
    private residentAwayDays$: ResidentAwayDaysService,
    private facilityEvent$: FacilityEventService,
    private residentSelector$: ResidentSelectorService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};
    this.calendarLastView = null;
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

            res.facility_events.forEach(event => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: event.rsvp === false ? '#5d99d7' : '#1e75d7',
                textColor: '#ffffff',
                id: event.id,
                event_type: CalendarEventType.FACILITY,
                start: event.all_day ? DateHelper.formatMoment(event.start, 'YYYY-MM-DD', true) : DateHelper.formatMoment(event.start, 'YYYY-MM-DD HH:mm:ss'),
                end: event.all_day ? null : DateHelper.formatMoment(event.end, 'YYYY-MM-DD HH:mm:ss'),
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
                start: DateHelper.formatMoment(event.start, 'YYYY-MM-DD HH:mm:ss'),
                end: DateHelper.formatMoment(event.end, 'YYYY-MM-DD HH:mm:ss'),
                title: event.title
              });
            });

            res.admissions.forEach(admission => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#fac22b',
                textColor: '#ffffff',
                id: admission.id,
                event_type: CalendarEventType.ADMISSION,
                start: DateHelper.formatMoment(admission.start, 'YYYY-MM-DD', true),
                end: null,
                title: (new AdmissionTypePipe()).transform(admission.admission_type)
              });
            });

            res.rents.forEach(rent => {
              // if (rent.end) {
              //   rent.end.setTime(rent.end.getTime() + 24 * 60 * 60 * 1000);
              // }

              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#009da1',
                textColor: '#ffffff',
                id: rent.id,
                event_type: CalendarEventType.RENT,
                start: DateHelper.formatMoment(rent.start, 'YYYY-MM-DD', true),
                end: null,
                title: (new CurrencyPipe('en-US')).transform(rent.amount, 'USD', 'symbol-narrow', '1.2-2')
              });

              this.calendarEvents.push({
                  borderColor: 'transparent',
                  backgroundColor: '#009da1',
                  textColor: '#ffffff',
                  id: rent.id,
                  event_type: CalendarEventType.RENT,
                  start: DateHelper.formatMoment(rent.end, 'YYYY-MM-DD', true),
                  end: DateHelper.formatMoment(rent.end, 'YYYY-MM-DD', true),
                  title: (new CurrencyPipe('en-US')).transform(rent.amount, 'USD', 'symbol-narrow', '1.2-2')
              });
            });

            res.rent_increases.forEach(rent_increase => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#603e95',
                textColor: '#ffffff',
                id: rent_increase.id,
                event_type: CalendarEventType.RENT_INCREASE,
                start: DateHelper.formatMoment(rent_increase.start, 'YYYY-MM-DD', true),
                end: null,
                title: (new CurrencyPipe('en-US')).transform(rent_increase.amount, 'USD', 'symbol-narrow', '1.2-2')
              });
            });

            res.away_days.forEach(away_day => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#ff00ff',
                textColor: '#ffffff',
                id: away_day.id,
                event_type: CalendarEventType.AWAY_DAYS,
                start: DateHelper.formatMoment(away_day.start, 'YYYY-MM-DD'),
                end: null,
                title: DateHelper.formatMoment(away_day.created_at, 'YYYY-MM-DD',  true)
              });

              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#ff00ff',
                textColor: '#ffffff',
                id: away_day.id,
                event_type: CalendarEventType.AWAY_DAYS,
                start: DateHelper.formatMoment(away_day.end, 'YYYY-MM-DD'),
                end: DateHelper.formatMoment(away_day.end, 'YYYY-MM-DD'),
                title: DateHelper.formatMoment(away_day.created_at, 'YYYY-MM-DD',  true)
              });
            });

            this.calendarComponent.getApi().changeView('dayGridMonth');
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

  show_modal_add(): void {
    this.create_modal(FormComponent, data => this.residentEvent$.add(data), null);
  }

  show_modal_edit(id: number, service$: any, form_component: any): void {
    service$.get(id).pipe(first()).subscribe(res => {
      if (res) {
        this.create_modal(form_component, data => service$.edit(data), res);
      }
    });
  }

  show_modal_view(id: number, service$: any, component: any): void {
    service$.get(id).pipe(first()).subscribe(res => {
      if (res) {
        this.create_modal_view(component, res);
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
      nzWidth: '35rem',
      nzTitle: null,
      nzContent: form_component,
      nzFooter: footer
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof ResidentEventViewComponent) {
        component.event = result;
      }
      if (component instanceof ResidentRentViewComponent) {
        component.event = result;
      }
      if (component instanceof FacilityEventViewComponent) {
        component.event = result;
      }
      if (component instanceof ResidentRentIncreaseViewComponent) {
        component.event = result;
      }

      if (component instanceof ResidentAwayDaysViewComponent) {
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
          const form_data = component.formValue();

          component.submitted = true;

          submit(form_data).subscribe(
            res => {
              loading = false;

              if (res) {
                this.subscribe('rs_resident');
              }

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
          const form_data = component.formValue();

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
      nzWidth: result === true ? '30rem' : '45rem',
      nzTitle: null,
      nzContent: form_component,
      nzFooter: footer
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof FormComponent || component instanceof MonthPickerFormComponent || component instanceof FacilityEventFormComponent) {
        const form = component.formObject;

        if (result !== null) {
          component.loaded.subscribe(v => {
            if (v) {
              component.edit_mode = true;
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
        this.facilityEvent$.isEditable($event.event.id).subscribe(res => {
          if (res) {
            this.show_modal_edit($event.event.id, this.facilityEvent$, FacilityEventFormComponent);
          } else {
            this.show_modal_view($event.event.id, this.facilityEvent$, FacilityEventViewComponent);
          }
        });
        break;
      case CalendarEventType.RESIDENT:
        this.show_modal_edit($event.event.id, this.residentEvent$, FormComponent);
        break;
      case CalendarEventType.RENT:
        this.show_modal_view($event.event.id, this.residentRent$, ResidentRentViewComponent);
        break;
      case CalendarEventType.RENT_INCREASE:
        this.show_modal_view($event.event.id, this.residentRentIncrease$, ResidentRentIncreaseViewComponent);
        break;
      case CalendarEventType.AWAY_DAYS:
        this.show_modal_view($event.event.id, this.residentAwayDays$, ResidentAwayDaysViewComponent);
        break;
      default:
        break;
    }
  }

  datesRender($event: any) {
    if ($event.view instanceof ListView) {
      let list = $event.el.querySelectorAll('.fc-list-table tbody');
      if (list.length > 0) {
        list = list[0];

        const renderedEvents = list.querySelectorAll('.fc-list-table  tr');
        const reorderedEvents = [];

        let blockEvents = null;

        renderedEvents.forEach(tr_element => {
          if (tr_element.className === 'fc-list-heading') {
            if (blockEvents) {
              reorderedEvents.unshift(...([].slice.call(blockEvents.children)));
            }
            blockEvents = document.createElement('tbody');
          }
          blockEvents.append(tr_element);
        });
        reorderedEvents.unshift(...([].slice.call(blockEvents.children)));
        list.innerHTML = '';
        reorderedEvents.forEach(tr_element => list.append(tr_element));
      }
    } else {
      if (this.calendarLastView instanceof ListView) {
        this.calendarComponent.getApi().today();
      }
    }

    this.calendarLastView = $event.view;
  }

}
