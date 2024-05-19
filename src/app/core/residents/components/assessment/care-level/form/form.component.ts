﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {first} from 'rxjs/operators';
import {AssessmentCareLevelGroup} from '../../../../models/assessment-care-level-group';
import {AssessmentCareLevelGroupService} from '../../../../services/assessment-care-level-group.service';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as CaleLevelGroupFormComponent} from '../../care-level-group/form/form.component';
import {CoreValidator} from '../../../../../../shared/utils/core-validator';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  care_level_groups: AssessmentCareLevelGroup[];

  constructor(
    private formBuilder: FormBuilder,
    private care_level_group$: AssessmentCareLevelGroupService,
    private modal$: NzModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(255)])],
      level_low: [0, Validators.required],
      level_high: [1, Validators.compose([CoreValidator.greaterThan('level_low')])],
      care_level_group_id: [[], Validators.required],
    });

    this.subscribe('list_care_level_group');
    this.subscribe('vc_care_level_group_id');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_care_level_group':
        this.$subscriptions[key] = this.care_level_group$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.care_level_groups = res;

            if (params) {
              this.form.get('care_level_group_id').setValue(params.care_level_group_id);
            }
          }
        });
        break;
      case 'vc_care_level_group_id':
        this.$subscriptions[key] = this.form.get('care_level_group_id').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('title').setValue(this.form.get('title').value);
          }
        });
        break;
      default:
        break;
    }
  }

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'care_level_group':
        this.create_modal(
          this.modal$,
          CaleLevelGroupFormComponent,
          data => this.care_level_group$.add(data),
          data => {
            this.subscribe('list_care_level_group', {care_level_group_id: data[0]});
            return null;
          });
        break;
      default:
        break;
    }
  }
}
