import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {MedicationService} from '../../../../services/medication.service';
import {ActivatedRoute} from '@angular/router';
import {Physician} from '../../../../models/physician';
import {PhysicianService} from '../../../../services/physician.service';
import {MedicationFormFactorService} from '../../../../services/medication-form-factor.service';
import {EventDefinitionService} from '../../../../services/event-definition.service';
import {ResponsiblePersonService} from '../../../../services/responsible-person.service';
import {EventDefinition} from '../../../../models/event-definition';
import {ResponsiblePerson} from '../../../../models/responsible-person';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  definitions: EventDefinition[];
  responsible_persons: ResponsiblePerson[];
  physicians: Physician[];

  resident_id: number;

  show: { date: boolean, physician: boolean, responsible_person: boolean } = {date: false, physician: false, responsible_person: false};

  list_loaded = {
    definition: false,
    physician: false,
    responsible_person: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private medication$: MedicationService,
    private form_factor$: MedicationFormFactorService,
    private definition$: EventDefinitionService,
    private responsible_person$: ResponsiblePersonService,
    private physician$: PhysicianService,
    private route$: ActivatedRoute) {
    super();

    this.loaded.next(false);
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],

      definition_id: [null, Validators.required],

      notes: ['', Validators.compose([Validators.maxLength(512)])],

      date: [new Date(), Validators.required],
      additional_date: [new Date(), Validators.required],

      physician_id: [null, Validators.required],
      responsible_person_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

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

            this.list_loaded.definition = true;
            this.loaded.next(this.list_loaded.definition && this.list_loaded.physician && this.list_loaded.responsible_person);
          }
        });
        break;
      case 'list_physician':
        this.$subscriptions[key] = this.physician$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.physicians = res;

            this.list_loaded.physician = true;
            this.loaded.next(this.list_loaded.definition && this.list_loaded.physician && this.list_loaded.responsible_person);
          }
        });
        break;
      case 'list_responsible_person':
        this.$subscriptions[key] = this.responsible_person$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.responsible_persons = res;

            this.list_loaded.responsible_person = true;
            this.loaded.next(this.list_loaded.definition && this.list_loaded.physician && this.list_loaded.responsible_person);
          }
        });
        break;
      case 'vc_definition_id':
        this.$subscriptions[key] = this.form.get('definition_id').valueChanges.subscribe(next => {
          const definition = this.definitions.filter(item => item.id === this.form.get('definition_id').value).pop();

          // TODO: review
          if (definition) {
            this.show.date = definition.additional_date;
            this.show.responsible_person = definition.responsible_person;
            this.show.physician = definition.physician;

            this.show.date ? this.form.get('additional_date').enable() : this.form.get('additional_date').disable();
            this.show.responsible_person ? this.form.get('responsible_person_id').enable() : this.form.get('responsible_person_id').disable();
            this.show.physician ? this.form.get('physician_id').enable() : this.form.get('physician_id').disable();
          }
        });
        break;
      default:
        break;
    }
  }

}
