import {Component, OnInit} from '@angular/core';
import {AssessmentTypeService} from '../../../services/assessment-type.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {AssessmentType} from '../../../models/assessment-type';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from './form/form.component';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<AssessmentType, AssessmentTypeService> implements OnInit {
  constructor(
    protected service$: AssessmentTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-assessment-assessment_type';
    this.name = 'assessment-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
