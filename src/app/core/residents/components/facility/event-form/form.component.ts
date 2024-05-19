import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {differenceInCalendarDays} from 'date-fns';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {EventDefinitionService} from '../../../services/event-definition.service';
import {CalendarEventType, EventDefinition, RepeatType} from '../../../models/event-definition';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as EventDefinitionFormComponent} from '../../event-definition/form/form.component';
import {User} from '../../../../models/user';
import {UserService} from '../../../../admin/services/user.service';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {Resident} from '../../../models/resident';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';
import {GroupType} from '../../../models/group-type.enum';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  definitions: EventDefinition[];

  residents: Resident[];
  users: User[];

  repeatTypes: { id: RepeatType, name: string }[];

  disabledEndDate = (value: Date): boolean => {
    if (!value || this.form.get('start_date').disabled) {
      return false;
    }

    const startDate = DateHelper.makeDateOnly(this.form.get('start_date').value);

    return differenceInCalendarDays(value, startDate) < 0;
  };

  disabledEndHours = (): number[] => {
    if (this.form.get('start_time').disabled) {
      return [];
    }

    const startDate = DateHelper.makeDateOnly(this.form.get('start_date').value);
    const endDate = DateHelper.makeDateOnly(this.form.get('end_date').value);
    const startTime = DateHelper.makeDateType(this.form.get('start_time').value);

    return startDate.getTime() === endDate.getTime() ? this.numberRange(startTime.getHours()) : [];
  };

  disabledEndMinutes = (hour: number): number[] => {
    if (this.form.get('start_time').disabled) {
      return [];
    }

    const startDate = DateHelper.makeDateOnly(this.form.get('start_date').value);
    const endDate = DateHelper.makeDateOnly(this.form.get('end_date').value);
    const startTime = DateHelper.makeDateType(this.form.get('start_time').value);

    return (startDate.getTime() === endDate.getTime() && startTime.getHours() === hour) ? this.numberRange(startTime.getMinutes()) : [];
  };

  disabledRepeatEndDate = (value: Date): boolean => {
    if (!value || (this.form.get('end_date').disabled && this.form.get('start_date').disabled)) {
      return false;
    }

    const startDate = DateHelper.makeDateOnly(this.form.get('start_date').value);
    const endDate = DateHelper.makeDateOnly(this.form.get('end_date').value);

    return (this.form.get('end_date').enabled && differenceInCalendarDays(value, endDate) < 0)
      || (this.form.get('start_date').enabled && differenceInCalendarDays(value, startDate) < 0);
  };

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private definition$: EventDefinitionService,
    private user$: UserService,
    private resident$: ResidentAdmissionService
  ) {
    super(modal$);
    this.modal_map = [
      {key: 'definition', component: EventDefinitionFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      definition_id: [null, Validators.required],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      users: [[], Validators.required],
      rsvp: [false, Validators.required],

      start_date: [DateHelper.newDate(), Validators.required],
      start_time: [DateHelper.newDate(), Validators.required],
      end_date: [DateHelper.newDate(), Validators.compose([Validators.required, CoreValidator.laterThanEqual('start_date', false)])],
      end_time: [DateHelper.newDate(), Validators.compose([Validators.required, CoreValidator.laterThan('start_time', true)])],

      all_day: [true, Validators.required],

      repeat: [null, Validators.required],
      repeat_end: [DateHelper.newDate()],
      no_repeat_end: [true, Validators.required],

      facility_id: [null, Validators.required],
      residents: [[], Validators.required]
    });

    this.form.get('users').disable();

    this.form.get('start_date').disable();
    this.form.get('start_time').disable();
    this.form.get('end_date').disable();
    this.form.get('end_time').disable();
    this.form.get('all_day').disable();

    this.form.get('repeat').disable();
    this.form.get('repeat_end').disable();
    this.form.get('no_repeat_end').disable();

    this.form.get('rsvp').disable();

    this.form.get('residents').disable();

    this.repeatTypes = [
      {id: RepeatType.EVERY_DAY, name: 'Every Day'},
      {id: RepeatType.EVERY_WEEK, name: 'Every Week'},
      {id: RepeatType.EVERY_MONTH, name: 'Every Month'}
    ];

    this.subscribe('list_definition');
    this.subscribe('list_user');
    this.subscribe('vc_facility_id');
    this.subscribe('vc_all_day');
    this.subscribe('vc_no_repeat_end');
    this.subscribe('vc_start_date');
    this.subscribe('vc_end_date');
    this.subscribe('vc_repeat_end');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_definition':
        this.$subscriptions[key] = this.definition$.all([{
          key: 'view',
          value: CalendarEventType.FACILITY.toString()
        }]).pipe(first()).subscribe(res => {
          if (res) {
            this.definitions = res;

            this.subscribe('vc_definition_id');

            if (params) {
              this.form.get('definition_id').setValue(params.definition_id);
            } else {
              this.form.get('definition_id').setValue(this.form.get('definition_id').value);
            }
          }
        });
        break;
      case 'list_user':
        this.$subscriptions[key] = this.user$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.users = res;
          }
        });
        break;
      case 'vc_start_date':
        this.$subscriptions[key] = this.form.get('start_date').valueChanges.subscribe(next => {
          if (next) {
            const value: Date = this.form.get('start_time').value;
            value.setFullYear(next.getFullYear());
            value.setMonth(next.getMonth());
            value.setDate(next.getDate());
            this.form.get('start_time').setValue(value);
          }
        });
        break;
      case 'vc_end_date':
        this.$subscriptions[key] = this.form.get('end_date').valueChanges.subscribe(next => {
          if (next) {
            const value: Date = this.form.get('end_time').value;
            value.setFullYear(next.getFullYear());
            value.setMonth(next.getMonth());
            value.setDate(next.getDate());
            this.form.get('end_time').setValue(value);
          }
        });
        break;
      case 'vc_repeat_end':
        this.$subscriptions[key] = this.form.get('repeat_end').valueChanges.subscribe(next => {
          if (next && next.getHours() !== 23 && next.getMinutes() !== 59 && next.getSeconds() !== 59) {
            const value: Date = this.form.get('repeat_end').value;
            value.setHours(23, 59, 59);
            this.form.get('repeat_end').setValue(value);
          }
        });
        break;
      case 'vc_all_day':
        this.$subscriptions[key] = this.form.get('all_day').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('start_time').disable();
            this.form.get('end_date').disable();
            this.form.get('end_time').disable();
          } else {
            this.form.get('start_time').enable();
            this.form.get('end_date').enable();
            this.form.get('end_time').enable();
          }
          this.form.get('end_date').updateValueAndValidity();
          this.form.get('end_time').updateValueAndValidity();
          this.updateRepeatValidators();
        });
        break;
      case 'vc_no_repeat_end':
        this.$subscriptions[key] = this.form.get('no_repeat_end').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('repeat_end').disable();
          } else {
            this.form.get('repeat_end').enable();
          }
          this.updateRepeatValidators();
        });
        break;
      case 'vc_definition_id':
        this.$subscriptions[key] = this.form.get('definition_id').valueChanges.subscribe(next => {
          if (next) {
            const definition = this.definitions.filter(item => item.id === next).pop();
            if (definition) {
              if (definition.users) {
                this.form.get('users').enable();
              } else {
                this.form.get('users').disable();
              }

              if (definition.duration) {
                this.form.get('start_date').enable();
                this.form.get('start_time').disable();
                this.form.get('end_date').enable();
                this.form.get('end_time').enable();
                this.form.get('all_day').enable();
              } else {
                this.form.get('start_date').disable();
                this.form.get('start_time').disable();
                this.form.get('end_date').disable();
                this.form.get('end_time').disable();
                this.form.get('all_day').disable();
              }

              if (definition.repeats) {
                this.form.get('repeat').enable();
                this.form.get('repeat_end').enable();
                this.form.get('no_repeat_end').enable();

                this.updateRepeatValidators();
              } else {
                this.form.get('repeat').disable();
                this.form.get('repeat_end').disable();
                this.form.get('no_repeat_end').disable();
                this.form.get('repeat_end').clearValidators();
              }

              if (definition.rsvp) {
                this.form.get('rsvp').enable();
              } else {
                this.form.get('rsvp').disable();
              }

              if (definition.residents) {
                this.form.get('residents').enable();
              } else {
                this.form.get('residents').disable();
              }
            }
          }
        });
        break;
      case 'list_resident':
        this.$subscriptions[key] = this.resident$
          .list_by_state('active', GroupType.FACILITY, params.facility_id).pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;
            }
          });
        break;
      case 'vc_facility_id':
        this.$subscriptions[key] = this.form.get('facility_id').valueChanges.subscribe(next => {
          if (next) {
            this.subscribe('list_resident', {facility_id: next});
          }
        });
        break;
      default:
        break;
    }
  }

  before_submit(): void {
    this.form.get('start_date').setValue(DateHelper.makeUTCDateOnly(this.form.get('start_date').value)); // TODO: #846 - Review date/time fields in all system
    this.form.get('end_date').setValue(DateHelper.makeUTCDateOnly(this.form.get('end_date').value)); // TODO: #846 - Review date/time fields in all system
  }

  private updateRepeatValidators() {
    const validators = [];

    this.form.get('repeat_end').clearValidators();
    this.form.get('repeat_end').updateValueAndValidity();

    if (this.form.get('start_date').enabled) {
      validators.push(CoreValidator.laterThan('start_date', false));
    }

    if (this.form.get('end_date').enabled) {
      validators.push(CoreValidator.laterThan('end_date', false));
    }

    this.form.get('repeat_end').setValidators(Validators.compose([Validators.required, ...validators]));
    this.form.get('repeat_end').updateValueAndValidity();
  }

  private numberRange(max: number): number[] {
    return Array.apply(null, Array(max)).map(function (_, i) {
      return i;
    });
  }
}
