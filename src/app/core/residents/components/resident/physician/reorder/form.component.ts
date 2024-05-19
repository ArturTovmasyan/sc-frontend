import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentPhysician} from '../../../../models/resident-physician';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  public resident_physicians: ResidentPhysician[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      physicians: this.formBuilder.array([])
    });
  }

  public get_form_array_skeleton(key: string): FormGroup | FormControl {
    switch (key) {
      case 'physicians':
        return this.formBuilder.group({
          id: ['']
        });
      default:
        return null;
    }
  }

  public before_submit(): void {
    const rows: FormArray = this.get_form_array('physicians');
    const rows_copy = [];

    for (const row of rows.controls) {
      rows_copy.push(row.value);
    }
    rows.reset(rows_copy);
  }

  public get_p_by_id(id: number) {
    return this.resident_physicians.filter(v => v.id === id).map(v => v.physician).pop();
  }
}
