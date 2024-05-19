import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
export class ListComponent extends GridComponent<AssessmentCareLevel, AssessmentCareLevelService> implements OnInit {
  constructor(service$: AssessmentCareLevelService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'assessment-care-level-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
