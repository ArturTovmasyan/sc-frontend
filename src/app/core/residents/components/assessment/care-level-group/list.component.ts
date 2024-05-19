import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {AssessmentCareLevelGroupService} from '../../../services/assessment-care-level-group.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {AssessmentCareLevelGroup} from '../../../models/assessment-care-level-group';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentCareLevelGroupService, ModalFormService]
})
export class ListComponent extends GridComponent<AssessmentCareLevelGroup, AssessmentCareLevelGroupService> implements OnInit {
  constructor(
    protected service$: AssessmentCareLevelGroupService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-assessment-care_level_group';
    this.name = 'assessment-care-level-group-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
