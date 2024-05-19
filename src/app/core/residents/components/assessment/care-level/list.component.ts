import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {AssessmentCareLevel} from '../../../models/assessment-care-level';
import {AssessmentCareLevelService} from '../../../services/assessment-care-level.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [AssessmentCareLevelService, ModalFormService]
})
export class ListComponent extends GridComponent<AssessmentCareLevel, AssessmentCareLevelService> implements OnInit {
  constructor(
    protected service$: AssessmentCareLevelService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'assessment-care-level-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
