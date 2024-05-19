import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {MedicationService} from '../../../services/medication.service';
import {MedicationFormFactorService} from '../../../services/medication-form-factor.service';
import {EventDefinitionService} from '../../../services/event-definition.service';
import {CalendarEventType, EventDefinition, EventDefinitionView, RepeatType} from '../../../models/event-definition';
import {ResidentResponsiblePersonService} from '../../../services/resident-responsible-person.service';
import {ResidentPhysicianService} from '../../../services/resident-physician.service';
import {ResidentResponsiblePerson} from '../../../models/resident-responsible-person';
import {ResidentPhysician} from '../../../models/resident-physician';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as ResidentPhysicianFormComponent} from '../../physician/form/form.component';
import {FormComponent as ResidentResponsiblePersonFormComponent} from '../../responsible-person/form/form.component';
import {FormComponent as EventDefinitionFormComponent} from '../../event-definition/form/form.component';
import {User} from '../../../../models/user';
import {Resident} from '../../../models/resident';
import {UserService} from '../../../../admin/services/user.service';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';
import {GroupType} from '../../../models/group-type.enum';
import {Facility} from '../../../models/facility';
import {Role} from '../../../../models/role';
import {FacilityService} from '../../../services/facility.service';
import {RoleService} from '../../../../admin/services/role.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  Infinity = Infinity;

  definitions: EventDefinition[];
  resident_responsible_persons: ResidentResponsiblePerson[];
  resident_physicians: ResidentPhysician[];
  residents: Resident[];
  users: User[];

  facilities: Facility[];
  roles: Role[];

  repeatTypes: { id: RepeatType, name: string }[];

  rp_single: boolean;

  required = {
    physician_id: false,
    responsible_persons: false,
  };

  disabledEndDate = (value: Date): boolean => {
    if (!value || this.form.get('start').disabled) {
      return false;
    }

    let startDate =  this.form.get('start').value;
    startDate = startDate instanceof Date ? startDate : new Date(startDate);

    return value.getTime() <= startDate.getTime();
  }

  disabledRepeatEndDate = (value: Date): boolean => {
    if (!value || (this.form.get('end').disabled && this.form.get('start').disabled)) {
      return false;
    }

    let startDate =  this.form.get('start').value;
    startDate = startDate instanceof Date ? startDate : new Date(startDate);

    let endDate =  this.form.get('end').value;
    endDate = endDate instanceof Date ? endDate : new Date(endDate);

    return (this.form.get('end').enabled && value.getTime() <= endDate.getTime())
      || (this.form.get('start').enabled && value.getTime() <= startDate.getTime());
  }

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private medication$: MedicationService,
    private form_factor$: MedicationFormFactorService,
    private definition$: EventDefinitionService,
    private resident_responsible_person$: ResidentResponsiblePersonService,
    private resident_physician$: ResidentPhysicianService,
    private resident$: ResidentAdmissionService,
    private facility$: FacilityService,
    private role$: RoleService,
    private user$: UserService
  ) {
    super(modal$);
    this.modal_map = [
      {key: 'resident_physician', component: ResidentPhysicianFormComponent},
      {key: 'resident_responsible_person', component: ResidentResponsiblePersonFormComponent},
      {key: 'definition', component: EventDefinitionFormComponent}
    ];

    this.rp_single = false;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      definition_id: [null, Validators.required],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      date: [DateHelper.convertUTC(new Date()), Validators.required],
      additional_date: [new Date(), Validators.required],

      physician_id: [null],

      responsible_persons: [null],

      residents: [[], Validators.required],
      users: [[], Validators.required],
      rsvp: [false, Validators.required],

      start: [DateHelper.convertUTC(new Date()), Validators.required],
      end: [DateHelper.convertUTC(new Date()), Validators.compose([Validators.required, CoreValidator.laterThan('start')])],
      all_day: [true, Validators.required],

      repeat: [null, Validators.required],
      repeat_end: [DateHelper.convertUTC(new Date())],
      no_repeat_end: [true, Validators.required],

      facilities: [[], Validators.required],
      roles: [[], Validators.required],
      done: [false, Validators.required],
    });

    this.form.get('date').disable();
    this.form.get('additional_date').disable();
    this.form.get('responsible_persons').disable();
    this.form.get('physician_id').disable();

    this.form.get('residents').disable();
    this.form.get('users').disable();

    this.form.get('start').disable();
    this.form.get('end').disable();
    this.form.get('all_day').disable();

    this.form.get('repeat').disable();
    this.form.get('repeat_end').disable();
    this.form.get('no_repeat_end').disable();

    this.form.get('rsvp').disable();

    this.form.get('facilities').disable();
    this.form.get('roles').disable();
    this.form.get('done').disable();

    this.repeatTypes = [
      {id: RepeatType.EVERY_DAY, name: 'Every Day'},
      {id: RepeatType.EVERY_WEEK, name: 'Every Week'},
      {id: RepeatType.EVERY_MONTH, name: 'Every Month'}
    ];

    this.subscribe('list_definition');
    this.subscribe('list_user');
    this.subscribe('list_facility');
    this.subscribe('list_role');
    this.subscribe('vc_all_day');
    this.subscribe('vc_no_repeat_end');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_definition':
        this.$subscriptions[key] = this.definition$.all([{key: 'view', value: CalendarEventType.CORPORATE.toString()}]).pipe(first()).subscribe(res => {
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
      case 'list_resident':
        this.$subscriptions[key] = this.resident$
          .list_by_state('active', GroupType.FACILITY, params.facility_id).pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;
            }
          });
        break;
      case 'list_user':
        this.$subscriptions[key] = this.user$.all(/** TODO: add filter**/).pipe(first()).subscribe(res => {
          if (res) {
            this.users = res;
          }
        });
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all(/** TODO: add filter**/).pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;
          }
        });
        break;
      case 'list_role':
        this.$subscriptions[key] = this.role$.all(/** TODO: add filter**/).pipe(first()).subscribe(res => {
          if (res) {
            this.roles = res;
          }
        });
        break;
      case 'list_resident_physician':
        this.$subscriptions[key] = this.resident_physician$.all([{
          key: 'resident_id',
          value: this.form.get('resident_id').value
        }]).pipe(first()).subscribe(res => {
          if (res) {
            this.resident_physicians = res;

            if (params) {
              const id = this.resident_physicians
                .filter(v => v.id === params.resident_physician_id).map(v => v.physician.id).pop();

              this.form.get('physician_id').setValue(id);
            } else {
              // this.form.get('physician_id').setValue(this.form.get('physician_id').value);
            }
          }
        });
        break;
      case 'list_resident_responsible_person':
        this.$subscriptions[key] = this.resident_responsible_person$.all([{
          key: 'resident_id',
          value: this.form.get('resident_id').value
        }]).pipe(first()).subscribe(res => {
          if (res) {
            this.resident_responsible_persons = res;

            if (params) {
              const id = this.resident_responsible_persons
                .filter(v => v.id === params.resident_responsible_person_id).map(v => v.responsible_person.id).pop();

              if (this.rp_single) {
                this.form.get('responsible_persons').setValue([id]);
              } else {
                const rps = _.isArray(this.form.get('responsible_persons').value) ? this.form.get('responsible_persons').value : [];
                rps.push(id);
                this.form.get('responsible_persons').setValue(rps);
              }

            } else {
              // this.form.get('responsible_persons').setValue(this.form.get('responsible_persons').value);
            }
          }
        });
        break;
      case 'vc_all_day':
        this.$subscriptions[key] = this.form.get('all_day').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('end').disable();
            this.form.get('end').updateValueAndValidity();
          } else {
            this.form.get('end').enable();
            this.form.get('end').updateValueAndValidity();
          }
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
              this.required = {
                physician_id: false,
                responsible_persons: false,
              };

              if (definition.additional_date) {
                this.form.get('additional_date').enable();
              } else {
                this.form.get('additional_date').disable();
              }

              if (definition.physician || definition.physician_optional) {
                this.form.get('physician_id').enable();
                // this.form.get('physician_id').reset(null);
                this.form.get('physician_id').clearValidators();

                if (definition.physician) {
                  this.required.physician_id = true;
                  this.form.get('physician_id').setValidators([Validators.required]);
                } else {
                  this.required.physician_id = false;
                }
              } else {
                this.form.get('physician_id').disable();
              }

              if (definition.responsible_person || definition.responsible_person_optional
                || definition.responsible_person_multi || definition.responsible_person_multi_optional) {

                this.form.get('responsible_persons').enable();
                // this.form.get('responsible_persons').reset(null);
                this.form.get('responsible_persons').clearValidators();

                this.rp_single = definition.responsible_person || definition.responsible_person_optional;

                if (definition.responsible_person || definition.responsible_person_multi) {
                  this.required.responsible_persons = true;
                  this.form.get('responsible_persons').setValidators([Validators.required]);
                } else {
                  this.required.responsible_persons = false;
                }
              } else {
                this.form.get('responsible_persons').disable();
              }


              if (definition.residents) {
                this.form.get('residents').enable();
              } else {
                this.form.get('residents').disable();
              }

              if (definition.users) {
                this.form.get('users').enable();
              } else {
                this.form.get('users').disable();
              }

              if (definition.duration) {
                this.form.get('date').disable();

                this.form.get('start').enable();
                this.form.get('end').enable();
                this.form.get('all_day').enable();
              } else {
                this.form.get('date').enable();

                this.form.get('start').disable();
                this.form.get('end').disable();
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

              if (definition.done) {
                this.form.get('done').enable();
              } else {
                this.form.get('done').disable();
              }

              if (definition.view === EventDefinitionView.CORPORATE) {
                this.form.get('facilities').enable();
                this.form.get('roles').enable();

                this.form.get('residents').disable();
              } else  {
                this.form.get('facilities').disable();
                this.form.get('roles').disable();

                this.form.get('residents').enable();
              }

              this.form.get('additional_date').updateValueAndValidity();
              this.form.get('physician_id').updateValueAndValidity();
              this.form.get('responsible_persons').updateValueAndValidity();
            }
          }
        });
        break;
      default:
        break;
    }
  }

  private updateRepeatValidators() {
    const validators = [];

    this.form.get('repeat_end').clearValidators();
    this.form.get('repeat_end').updateValueAndValidity();

    if (this.form.get('start').enabled) {
      validators.push(CoreValidator.laterThan('start'));
    }

    if (this.form.get('end').enabled) {
      validators.push(CoreValidator.laterThan('end'));
    }

    this.form.get('repeat_end').setValidators(Validators.compose([Validators.required, ...validators]));
    this.form.get('repeat_end').updateValueAndValidity();
  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    if (this.edit_mode) {
      data.date = DateHelper.convertUTC(data.date);
      data.additional_date = DateHelper.convertUTC(data.additional_date);
      data.start = DateHelper.convertUTC(data.start);
      data.end = DateHelper.convertUTC(data.end);
      data.repeat_end = DateHelper.convertUTC(data.end);
    }
  }

}
