import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin, {ListView} from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {CurrencyPipe} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../../guards/auth.guard';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {AdmissionTypePipe} from '../../../pipes/admission-type.pipe';
import {CalendarEventType, EventDefinition} from '../../../models/event-definition';
import {FacilityService} from '../../../services/facility.service';
import {FacilityEventService} from '../../../services/facility-event.service';
import {EventDefinitionService} from '../../../services/event-definition.service';
import {ResidentEventService} from '../../../services/resident-event.service';
import {ResidentRentIncreaseService} from '../../../services/resident-rent-increase.service';
import {ResidentAwayDaysService} from '../../../services/resident-away-days.service';
import {ResidentRentService} from '../../../services/resident-rent.service';
import {FormComponent} from '../event-form/form.component';
import {FormComponent as MonthPickerFormComponent} from '../../../../../shared/components/month-picker-form/form.component';
import {ViewComponent as ResidentEventViewComponent} from '../../resident/event/view/view.component';
import {ViewComponent as ResidentRentViewComponent} from '../../resident/rent/rent/view/view.component';
import {ViewComponent as ResidentRentIncreaseViewComponent} from '../../resident/rent/rent-increase/view/view.component';
import {ViewComponent as ResidentAwayDaysViewComponent} from '../../resident/ledger/away-days/view/view.component';

@Component({
  selector: 'app-facility-calendar',
  templateUrl: './calendar.component.html',
  providers: []
})
export class CalendarComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  @Input() facility_id: number;
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

  event_definitions: EventDefinition[];

  filter_chooser_all: any;
  filter_chooser: any;
  show_resident_fake: boolean;
  show_resident: boolean;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private facility$: FacilityService,
    private facilityEvent$: FacilityEventService,
    private residentEvent$: ResidentEventService,
    private residentRent$: ResidentRentService,
    private residentRentIncrease$: ResidentRentIncreaseService,
    private residentAwayDays$: ResidentAwayDaysService,
    private eventDefinition$: EventDefinitionService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};

    this.show_resident_fake = true;
    this.show_resident = true;

    this.filter_chooser_all = {type: 'all', definition_id: null};
    this.filter_chooser = this.filter_chooser_all;
  }

  ngOnInit(): void {
    this.subscribe('list_event_definition');
    this.subscribe('list_calendar', {
      type: this.filter_chooser.type,
      definition_id: this.filter_chooser.definition_id,
      show_resident: true
    });
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
                  start: event.all_day ? DateHelper.formatMoment(event.start, 'YYYY-MM-DD') : DateHelper.formatMoment(event.start, 'YYYY-MM-DD HH:mm:ss'),
                  end: event.all_day ? null : DateHelper.formatMoment(event.end, 'YYYY-MM-DD HH:mm:ss'),
                  title: event.title
                });
              });

              if (params.show_resident) {
                if (this.filter_chooser.type === 'all' || this.filter_chooser.type === 'event') {
                  res.resident_events.forEach(event => {
                    this.calendarEvents.push({
                      borderColor: 'transparent',
                      backgroundColor: '#d7255d',
                      textColor: '#ffffff',
                      id: event.id,
                      event_type: CalendarEventType.RESIDENT,
                      start: DateHelper.formatMoment(event.start, 'YYYY-MM-DD HH:mm:ss'),
                      end: DateHelper.formatMoment(event.end, 'YYYY-MM-DD HH:mm:ss'),
                      title: this.formatResident(CalendarEventType.RESIDENT, event),
                    });
                  });
                }

                if (this.filter_chooser.type === 'all' || this.filter_chooser.type === 'rent') {
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
                      start: DateHelper.formatMoment(rent.start, 'YYYY-MM-DD'),
                      end: null,
                      title: this.formatResident(CalendarEventType.RENT, rent)
                    });

                    this.calendarEvents.push({
                        borderColor: 'transparent',
                        backgroundColor: '#009da1',
                        textColor: '#ffffff',
                        id: rent.id,
                        event_type: CalendarEventType.RENT,
                        start: DateHelper.formatMoment(rent.end, 'YYYY-MM-DD'),
                        end: DateHelper.formatMoment(rent.end, 'YYYY-MM-DD'),
                        title: this.formatResident(CalendarEventType.RENT, rent)
                    });
                  });
                }

                if (this.filter_chooser.type === 'all' || this.filter_chooser.type === 'rent_increase') {
                  res.rent_increases.forEach(rent_increase => {
                    this.calendarEvents.push({
                      borderColor: 'transparent',
                      backgroundColor: '#603e95',
                      textColor: '#ffffff',
                      id: rent_increase.id,
                      event_type: CalendarEventType.RENT_INCREASE,
                      start: DateHelper.formatMoment(rent_increase.start, 'YYYY-MM-DD'),
                      end: null,
                      title: this.formatResident(CalendarEventType.RENT_INCREASE, rent_increase),
                    });
                  });
                }
              }

              if (this.filter_chooser.type === 'all' || this.filter_chooser.type === 'away_day') {
                res.away_days.forEach(away_day => {

                  this.calendarEvents.push({
                    borderColor: 'transparent',
                    backgroundColor: '#ff00ff',
                    textColor: '#ffffff',
                    id: away_day.id,
                    event_type: CalendarEventType.AWAY_DAYS,
                    start: DateHelper.formatMoment(away_day.start, 'YYYY-MM-DD'),
                    end: null,
                    title: away_day.reason.length > 20 ? away_day.reason.substring(0, 20) + '...' : away_day.reason
                  });

                  this.calendarEvents.push({
                    borderColor: 'transparent',
                    backgroundColor: '#ff00ff',
                    textColor: '#ffffff',
                    id: away_day.id,
                    event_type: CalendarEventType.AWAY_DAYS,
                    start: DateHelper.formatMoment(away_day.end, 'YYYY-MM-DD'),
                    end: DateHelper.formatMoment(away_day.end, 'YYYY-MM-DD'),
                    title: away_day.reason.length > 20 ? away_day.reason.substring(0, 20) + '...' : away_day.reason
                  });
                });
              }

              this.calendarComponent.getApi().changeView('dayGridMonth');
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
        subValue = (new CurrencyPipe('en-US')).transform(event.amount, 'USD', 'symbol-narrow', '1.2-2');
        break;
      case CalendarEventType.RENT_INCREASE:
        subValue = (new CurrencyPipe('en-US')).transform(event.amount, 'USD', 'symbol-narrow', '1.2-2');
        break;
      case CalendarEventType.AWAY_DAYS:
        subValue = event.title;
        break;
    }

    return `${event.room_number} (${event.bed_number}) ${event.first_name} ${event.last_name} - ${subValue}`;
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
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
                this.subscribe('list_calendar', {
                  type: this.filter_chooser.type,
                  definition_id: this.filter_chooser.definition_id,
                  show_resident: this.show_resident
                });
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

              this.subscribe('list_calendar', {
                type: this.filter_chooser.type,
                definition_id: this.filter_chooser.definition_id,
                show_resident: this.show_resident
              });

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
      if (component instanceof FormComponent || component instanceof MonthPickerFormComponent) {
        const form = component.formObject;

        if (component instanceof FormComponent) {
          form.get('facility_id').setValue(this.facility_id);
        }

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
        this.show_modal_edit($event.event.id);
        break;
      case CalendarEventType.RESIDENT:
        this.show_modal_view($event.event.id, this.residentEvent$, ResidentEventViewComponent);
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

  type_change($event: any) {
    if (this.filter_chooser === null) {
      this.filter_chooser = {type: 'all', definition_id: null};
    }

    this.subscribe('list_calendar', {
      type: this.filter_chooser.type,
      definition_id: this.filter_chooser.definition_id,
      show_resident: this.show_resident
    });
  }

  switch_change($event: any) {
    this.show_resident = $event;
    this.subscribe('list_calendar', {
      type: this.filter_chooser.type,
      definition_id: this.filter_chooser.definition_id,
      show_resident: this.show_resident
    });
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
