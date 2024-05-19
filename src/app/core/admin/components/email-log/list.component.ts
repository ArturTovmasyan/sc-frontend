import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {EmailLogService} from '../../services/email-log.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {EmailLog} from '../../../models/email-log';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [EmailLogService, ModalFormService]
})
export class ListComponent extends GridComponent<EmailLog, EmailLogService> implements OnInit {
  constructor(
    protected service$: EmailLogService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = null;
    this.permission = 'persistence-common-email_log';
    this.name = 'admin-email-log-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
