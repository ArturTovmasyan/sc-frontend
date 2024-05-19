import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {AssessmentCareLevelGroupService} from '../../../services/assessment-care-level-group.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {AssessmentCareLevelGroup} from '../../../models/assessment-care-level-group';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentCareLevelGroupService]
})
export class ListComponent extends GridComponent<AssessmentCareLevelGroup, AssessmentCareLevelGroupService> implements OnInit {
  constructor(service$: AssessmentCareLevelGroupService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'assessment-care-level-group-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
