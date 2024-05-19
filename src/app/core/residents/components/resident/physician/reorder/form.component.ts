import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ResidentPhysician} from '../../../../models/resident-physician';
import {ResidentPhysicianService} from '../../../../services/resident-physician.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  public resident_physicians: ResidentPhysician[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private residentSelector$: ResidentSelectorService,
    private residentPhysician$: ResidentPhysicianService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      physicians: this.formBuilder.array([])
    });

    this.subscribe('list_resident_physician');
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

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_resident_physician':
        this.$subscriptions[key] = this.residentPhysician$
          .all([{key: 'resident_id', value: `${this.residentSelector$.resident.value}`}])
          .pipe(first()).subscribe(next => {
            if (next) {
              this.resident_physicians = next;
            }
          });
        break;
      default:
        break;
    }
  }

  public get_by_id(id: number) {
    if (!this.resident_physicians) {
      return;
    }
    return this.resident_physicians.filter(v => v.id === id).map(v => v.physician).pop();
  }
}
