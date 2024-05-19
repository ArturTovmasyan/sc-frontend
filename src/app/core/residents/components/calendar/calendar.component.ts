import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../guards/auth.guard';
import {CalendarEventType} from '../../models/event-definition';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {FormComponent} from './form/form.component';
import {UserService} from '../../../admin/services/user.service';
import {CorporateEventService} from '../../services/corporate-event.service';
import {TitleService} from '../../../services/title.service';
import {DateHelper} from '../../../../shared/helpers/date-helper';

@Component({
  selector: 'app-corporate-calendar',
  templateUrl: './calendar.component.html',
  providers: []
})
export class CalendarComponent implements OnInit, OnDestroy {
  title: string;

  calendarPlugins = [dayGridPlugin, listPlugin, bootstrapPlugin]; // important!
  calendarCustomButtons = {
    add_event: {
      text: 'Add Event',
      click: () => this.show_modal_add()
    }
  };

  calendarHeader = {left: 'prev,next today add_event', center: 'title', right: 'dayGridMonth,dayGridWeek,dayGridDay,listAll'};
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
    private title$: TitleService,
    private modal$: NzModalService,
    private user$: UserService,
    private corporateEvent$: CorporateEventService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};

    this.title$.getTitle().subscribe(v => this.title = v);
  }

  ngOnInit(): void {
    this.subscribe('list_calendar');
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
      case 'list_calendar':
        this.$subscriptions[key] = this.user$.calendar(null, null).pipe(first()).subscribe(res => {
          if (res) {
            this.calendarEvents = [];

            res.corporate_events.forEach(event => {
              this.calendarEvents.push({
                borderColor: 'transparent',
                backgroundColor: '#b065d7',
                textColor: '#ffffff',
                id: event.id,
                event_type: CalendarEventType.CORPORATE,
                start: event.all_day ? DateHelper.formatMoment(event.start, 'YYYY-MM-DD', true) : DateHelper.formatMoment(event.start, 'YYYY-MM-DD HH:mm:ss'),
                end:  event.all_day ? null : DateHelper.formatMoment(event.end, 'YYYY-MM-DD HH:mm:ss'),
                title: event.title
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

  show_modal_add(): void {
    this.create_modal(FormComponent, data => this.corporateEvent$.add(data), null);
  }

  show_modal_edit(id: number): void {
    this.corporateEvent$.get(id).pipe(first()).subscribe(res => {
      if (res) {
        this.create_modal(FormComponent, data => this.corporateEvent$.edit(data), res);
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
    if ($event.event.extendedProps.event_type === CalendarEventType.CORPORATE) {
      this.corporateEvent$.isDone($event.event.id).subscribe(res => {
        if (res) {
          this.modal$.confirm({
            nzTitle: `<i>Do you to set status to DONE for this event?</i>`,
            nzOnOk: () => {
              this.corporateEvent$.setDone($event.event.id).subscribe(s => {
              });
            }
          });
        } else {
          this.show_modal_edit($event.event.id);
        }
      });
    }
  }
}
