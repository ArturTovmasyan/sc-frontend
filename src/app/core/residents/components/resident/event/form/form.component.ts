import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {EventDefinitionService} from '../../../../services/event-definition.service';
import {CalendarEventType, EventDefinition} from '../../../../models/event-definition';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ResidentResponsiblePersonService} from '../../../../services/resident-responsible-person.service';
import {ResidentPhysicianService} from '../../../../services/resident-physician.service';
import {ResidentResponsiblePerson} from '../../../../models/resident-responsible-person';
import {ResidentPhysician} from '../../../../models/resident-physician';
import {DateHelper} from '../../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {FormComponent as ResidentPhysicianFormComponent} from '../../physician/form/form.component';
import {FormComponent as ResidentResponsiblePersonFormComponent} from '../../responsible-person/form/form.component';
import {FormComponent as EventDefinitionFormComponent} from '../../../event-definition/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  Infinity = Infinity;

  definitions: EventDefinition[];
  resident_responsible_persons: ResidentResponsiblePerson[];
  resident_physicians: ResidentPhysician[];

  rp_single: boolean;

  required = {
    physician_id: false,
    responsible_persons: false,
  };

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private definition$: EventDefinitionService,
    private resident_responsible_person$: ResidentResponsiblePersonService,
    private resident_physician$: ResidentPhysicianService,
    private residentSelector$: ResidentSelectorService
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

      resident_id: [null, Validators.required],
      definition_id: [null, Validators.required],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      date: [DateHelper.newDate(), Validators.required],
      additional_date: [DateHelper.newDate(), Validators.required],

      physician_id: [null],
      responsible_persons: [null]

    });

    this.form.get('additional_date').disable();
    this.form.get('responsible_persons').disable();
    this.form.get('physician_id').disable();

    this.subscribe('list_definition');
    this.subscribe('rs_resident');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_definition':
        this.$subscriptions[key] = this.definition$.all([{
          key: 'view',
          value: CalendarEventType.RESIDENT.toString()
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

              this.form.get('additional_date').updateValueAndValidity();
              this.form.get('physician_id').updateValueAndValidity();
              this.form.get('responsible_persons').updateValueAndValidity();
            }
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);

            this.subscribe('list_resident', {facility_id: this.residentSelector$.group.value});
            this.subscribe('list_resident_physician');
            this.subscribe('list_resident_responsible_person');
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
      default:
        break;
    }
  }

  formValue(): void {
    const value = super.formValue();
    value.date = DateHelper.makeUTCDateTimeOnly(value.date);

    if (value.additional_date) {
      value.additional_date = DateHelper.makeUTCDateTimeOnly(value.additional_date);
    }

    return value;
  }

}
