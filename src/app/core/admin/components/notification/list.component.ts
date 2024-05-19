import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {NotificationService} from '../../services/notification.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Notification} from '../../../models/notification';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [NotificationService, ModalFormService]
})
export class ListComponent extends GridComponent<Notification, NotificationService> implements OnInit {
  constructor(
    protected service$: NotificationService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'admin-notification-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
