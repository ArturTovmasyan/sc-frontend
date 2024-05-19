import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentResponsiblePerson} from '../../../../models/resident-responsible-person';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  public resident_responsible_persons: ResidentResponsiblePerson[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      responsible_persons: this.formBuilder.array([])
    });
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

  public get_rp_by_id(id: number) {
    return this.resident_responsible_persons.filter(v => v.id === id).map(v => v.responsible_person).pop();
  }
}
