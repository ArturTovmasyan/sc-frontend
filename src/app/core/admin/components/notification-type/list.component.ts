import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {NotificationTypeService} from '../../services/notification-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {NotificationType} from '../../../models/notification-type';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [NotificationTypeService]
})
export class ListComponent extends GridComponent<NotificationType, NotificationTypeService> implements OnInit {
  constructor(
    protected service$: NotificationTypeService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'admin-notification-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
