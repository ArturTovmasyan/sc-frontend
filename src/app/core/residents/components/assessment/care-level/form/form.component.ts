import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {AssessmentCareLevelGroup} from '../../../../models/assessment-care-level-group';
import {AssessmentCareLevelGroupService} from '../../../../services/assessment-care-level-group.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  care_level_groups: AssessmentCareLevelGroup[];

  constructor(private formBuilder: FormBuilder, private care_level_group$: AssessmentCareLevelGroupService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      level_low: [0, Validators.required],
      level_high: [0],
      care_level_group_id: [null, Validators.required],
    });

    this.care_level_group$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.care_level_groups = res;
      }
    });
  }

}
