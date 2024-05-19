import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ResidentResponsiblePerson} from '../../../../models/resident-responsible-person';
import {ResidentResponsiblePersonService} from '../../../../services/resident-responsible-person.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  public resident_responsible_persons: ResidentResponsiblePerson[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private residentSelector$: ResidentSelectorService,
    private residentResponsiblePerson$: ResidentResponsiblePersonService,
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      responsible_persons: this.formBuilder.array([])
    });

    this.subscribe('list_resident_responsible_person');
  }

  public get_form_array_skeleton(key: string): FormGroup | FormControl {
    switch (key) {
      case 'responsible_persons':
        return this.formBuilder.group({
          id: ['']
        });
      default:
        return null;
    }
  }

  public before_submit(): void {
    const rows: FormArray = this.get_form_array('responsible_persons');
    const rows_copy = [];

    for (const row of rows.controls) {
      rows_copy.push(row.value);
    }
    rows.reset(rows_copy);
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_resident_responsible_person':
        this.$subscriptions[key] = this.residentResponsiblePerson$
          .all([{key: 'resident_id', value: `${this.residentSelector$.resident.value}`}])
          .pipe(first()).subscribe(next => {
            if (next) {
              this.resident_responsible_persons = next;
            }
          });
        break;
      default:
        break;
    }
  }

  public get_by_id(id: number) {
    if (!this.resident_responsible_persons) {
      return;
    }
    return this.resident_responsible_persons.filter(v => v.id === id).map(v => v.responsible_person).pop();
  }
}
