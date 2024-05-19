import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {AssessmentFormService} from '../../../services/assessment-form.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {AssessmentForm} from '../../../models/assessment-form';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentFormService]
})
export class ListComponent extends GridComponent<AssessmentForm, AssessmentFormService> implements OnInit {
  constructor(
    protected service$: AssessmentFormService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'assessment-form-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
