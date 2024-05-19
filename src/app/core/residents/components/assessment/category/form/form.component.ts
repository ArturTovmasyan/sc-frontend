import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../../models/space';
import {SpaceService} from '../../../../../services/space.service';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  constructor(private formBuilder: FormBuilder, private space$: SpaceService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([Validators.required, Validators.max(255)])],
      multi_item: [false, Validators.compose([Validators.required])],

      rows: this.formBuilder.array([]),

      space_id: [null, Validators.required],
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'rows':
        return this.formBuilder.group({
          id: [null],
          title: ['', Validators.required],
          score: [0, Validators.required]
        });
      default:
        return null;
    }
  }

  public before_submit(): void {
    const rows: FormArray = this.get_form_array('rows');
    const rows_copy = [];

    for (const row of rows.controls) {
      rows_copy.push(row.value);
    }
    rows.reset(rows_copy);
  }
}
