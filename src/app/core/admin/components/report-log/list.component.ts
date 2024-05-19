import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ReportLogService} from '../../services/report-log.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {ReportLog} from '../../../models/report-log';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ReportLogService, ModalFormService]
})
export class ListComponent extends GridComponent<ReportLog, ReportLogService> implements OnInit {
  constructor(
    protected service$: ReportLogService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = null;
    this.permission = 'persistence-security-report_log';
    this.name = 'admin-report-log-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
