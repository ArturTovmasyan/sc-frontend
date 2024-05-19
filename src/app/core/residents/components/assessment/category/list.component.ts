import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {AssessmentCategoryService} from '../../../services/assessment-category.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {AssessmentCategory} from '../../../models/assessment-category';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentCategoryService]
})
export class ListComponent extends GridComponent<AssessmentCategory, AssessmentCategoryService> implements OnInit {
  constructor(service$: AssessmentCategoryService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'assessment-category-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
