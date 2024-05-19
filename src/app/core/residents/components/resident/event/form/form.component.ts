import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {MedicationService} from '../../../../services/medication.service';
import {Physician} from '../../../../models/physician';
import {PhysicianService} from '../../../../services/physician.service';
import {MedicationFormFactorService} from '../../../../services/medication-form-factor.service';
import {EventDefinitionService} from '../../../../services/event-definition.service';
import {ResponsiblePersonService} from '../../../../services/responsible-person.service';
import {EventDefinition} from '../../../../models/event-definition';
import {ResponsiblePerson} from '../../../../models/responsible-person';
import {FormComponent as EventDefinitionFormComponent} from '../../../event-definition/form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  definitions: EventDefinition[];
  responsible_persons: ResponsiblePerson[];
  physicians: Physician[];

  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private medication$: MedicationService,
    private form_factor$: MedicationFormFactorService,
    private definition$: EventDefinitionService,
    private responsible_person$: ResponsiblePersonService,
    private physician$: PhysicianService,
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

      physician_id: [null, Validators.required],
      responsible_person_id: [null, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.form.get('additional_date').disable();
    this.form.get('responsible_person_id').disable();
    this.form.get('physician_id').disable();

    this.subscribe('rs_resident');
    this.subscribe('list_definition');
    this.subscribe('list_physician');
    this.subscribe('list_responsible_person');
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
      case 'list_physician':
        this.$subscriptions[key] = this.physician$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.physicians = res;
            this.form.get('physician_id').setValue(this.form.get('physician_id').value);
          }
        });
        break;
      case 'list_responsible_person':
        this.$subscriptions[key] = this.responsible_person$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.responsible_persons = res;
            this.form.get('responsible_person_id').setValue(this.form.get('responsible_person_id').value);
          }
        });
        break;
      case 'vc_definition_id':
        this.$subscriptions[key] = this.form.get('definition_id').valueChanges.subscribe(next => {
          if (next) {
            const definition = this.definitions.filter(item => item.id === next).pop();

            if (definition) {
              if (definition.additional_date) {
                this.form.get('additional_date').enable();
              } else {
                this.form.get('additional_date').disable();
              }

              if (definition.physician) {
                this.form.get('physician_id').enable();
              } else {
                this.form.get('physician_id').disable();
              }

              if (definition.responsible_person) {
                this.form.get('responsible_person_id').enable();
              } else {
                this.form.get('responsible_person_id').disable();
              }
            }
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
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
      default:
        break;
    }
  }

}
