import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../../models/space';
import {SpaceService} from '../../../../../services/space.service';
import {first} from 'rxjs/operators';
import {AssessmentCareLevelGroup} from '../../../../models/assessment-care-level-group';
import {AssessmentCareLevelGroupService} from '../../../../services/assessment-care-level-group.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];
  care_level_groups: AssessmentCareLevelGroup[];

  constructor(private formBuilder: FormBuilder, private care_level_group$: AssessmentCareLevelGroupService, private space$: SpaceService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([Validators.required, Validators.max(255)])],
      level_low: [0, Validators.required],
      level_high: [0],
      care_level_group_id: [null, Validators.required],
      space_id: [null, Validators.required],
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });

    this.care_level_group$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.care_level_groups = res;
      }
    });
  }

}
