import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {AssessmentCategoryService} from '../../../services/assessment-category.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {AssessmentCategory} from '../../../models/assessment-category';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentCategoryService, ModalFormService]
})
export class ListComponent extends GridComponent<AssessmentCategory, AssessmentCategoryService> implements OnInit {
  constructor(
    protected service$: AssessmentCategoryService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-assessment-category';
    this.name = 'assessment-category-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
