import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {MedicationService} from '../../../../services/medication.service';
import {MedicationFormFactorService} from '../../../../services/medication-form-factor.service';
import {EventDefinitionService} from '../../../../services/event-definition.service';
import {EventDefinition} from '../../../../models/event-definition';
import {FormComponent as EventDefinitionFormComponent} from '../../../event-definition/form/form.component';
import {FormComponent as ResidentPhysicianFormComponent} from '../../physician/form/form.component';
import {FormComponent as ResidentResponsiblePersonFormComponent} from '../../responsible-person/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ResidentResponsiblePersonService} from '../../../../services/resident-responsible-person.service';
import {ResidentPhysicianService} from '../../../../services/resident-physician.service';
import {ResidentResponsiblePerson} from '../../../../models/resident-responsible-person';
import {ResidentPhysician} from '../../../../models/resident-physician';
import {DateHelper} from '../../../../../../shared/helpers/date-helper';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  definitions: EventDefinition[];
  resident_responsible_persons: ResidentResponsiblePerson[];
  resident_physicians: ResidentPhysician[];

  Infinity = Infinity;
  rp_single: boolean = false;

  required = {
    physician_id: false,
    responsible_persons: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private medication$: MedicationService,
    private form_factor$: MedicationFormFactorService,
    private definition$: EventDefinitionService,
    private resident_responsible_person$: ResidentResponsiblePersonService,
    private resident_physician$: ResidentPhysicianService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      definition_id: [null, Validators.required],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      date: [new Date(), Validators.required],
      additional_date: [new Date(), Validators.required],

      physician_id: [null],

      responsible_persons: [null],

      resident_id: [null, Validators.required]
    });

    this.form.get('additional_date').disable();
    this.form.get('responsible_persons').disable();
    this.form.get('physician_id').disable();

    this.subscribe('rs_resident');
    this.subscribe('list_definition');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_definition':
        this.$subscriptions[key] = this.definition$.all().pipe(first()).subscribe(res => {
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
              //this.form.get('physician_id').setValue(this.form.get('physician_id').value);
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
              //this.form.get('responsible_persons').setValue(this.form.get('responsible_persons').value);
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

            this.subscribe('list_resident_physician');
            this.subscribe('list_resident_responsible_person');
          }
        });
        break;
      default:
        break;
    }
  }

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'definition':
        this.create_modal(
          this.modal$,
          EventDefinitionFormComponent,
          data => this.definition$.add(data),
          data => {
            this.subscribe('list_definition', {definition_id: data[0]});
            return null;
          });
        break;
      case 'resident_physician':
        this.create_modal(
          this.modal$,
          ResidentPhysicianFormComponent,
          data => this.resident_physician$.add(data),
          data => {
            this.subscribe('list_resident_physician', {resident_physician_id: data[0]});
            return null;
          });
        break;
      case 'resident_responsible_person':
        this.create_modal(
          this.modal$,
          ResidentResponsiblePersonFormComponent,
          data => this.resident_responsible_person$.add(data),
          data => {
            this.subscribe('list_resident_responsible_person', {resident_responsible_person_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }

  before_set_form_data(data: any, previous_data?: any): void {
    super.before_set_form_data(data, previous_data);

    data.date = DateHelper.convertUTC(data.date);
    data.additional_date = DateHelper.convertUTC(data.additional_date);
  }

}
