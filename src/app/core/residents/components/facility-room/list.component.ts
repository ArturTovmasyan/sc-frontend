import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {FacilityRoomService} from '../../services/facility-room.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FacilityRoom} from '../../models/facility-room';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityRoomService]
})
export class ListComponent extends GridComponent<FacilityRoom, FacilityRoomService> {
  constructor(service$: FacilityRoomService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'facility-room-list';
  }
}
