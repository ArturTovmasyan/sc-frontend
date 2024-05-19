import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ActivityStatusService} from '../../services/activity-status.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ActivityStatus} from '../../models/activity-status';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityStatusService]
})
export class ListComponent extends GridComponent<ActivityStatus, ActivityStatusService> implements OnInit {
  constructor(
    protected service$: ActivityStatusService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-activity-status-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
