import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {FunnelStageService} from '../../services/funnel-stage.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FunnelStage} from '../../models/funnel-stage';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FunnelStageService, ModalFormService]
})
export class ListComponent extends GridComponent<FunnelStage, FunnelStageService> implements OnInit {
  constructor(
    protected service$: FunnelStageService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-funnel_stage';
    this.name = 'lead-funnel-stage-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
