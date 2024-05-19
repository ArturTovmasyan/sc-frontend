import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentEventService} from '../../../services/resident-event.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentEvent} from '../../../models/resident-event';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentEventService]
})
export class ListComponent extends GridComponent<ResidentEvent, ResidentEventService> {
  constructor(service$: ResidentEventService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-event-list';
  }
}
