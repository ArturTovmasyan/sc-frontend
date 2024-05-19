import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {StateChangeReasonService} from '../../services/state-change-reason.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {StateChangeReason} from '../../models/state-change-reason';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [StateChangeReasonService]
})
export class ListComponent extends GridComponent<StateChangeReason, StateChangeReasonService> implements OnInit {
  constructor(
    protected service$: StateChangeReasonService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-state-change-reason-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
