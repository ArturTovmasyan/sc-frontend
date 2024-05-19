import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {AssessmentCareLevel} from '../../../models/assessment-care-level';
import {AssessmentCareLevelService} from '../../../services/assessment-care-level.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentCareLevelService]
})
export class ListComponent extends GridComponent<AssessmentCareLevel, AssessmentCareLevelService> {
  constructor(service$: AssessmentCareLevelService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'assessment-care-level-list';
  }
}
