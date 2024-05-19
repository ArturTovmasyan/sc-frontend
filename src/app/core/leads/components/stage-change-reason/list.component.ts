import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {StageChangeReasonService} from '../../services/stage-change-reason.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {StageChangeReason} from '../../models/stage-change-reason';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [StageChangeReasonService, ModalFormService]
})
export class ListComponent extends GridComponent<StageChangeReason, StageChangeReasonService> implements OnInit {
  constructor(
    protected service$: StageChangeReasonService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-stage_change_reason';
    this.name = 'lead-stage-change-reason-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
