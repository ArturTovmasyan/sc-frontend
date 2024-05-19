import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {FacilityDiningRoomService} from '../../services/facility-dining-room.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FacilityDiningRoom} from '../../models/facility-dining-room';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityDiningRoomService]
})
export class ListComponent extends GridComponent<FacilityDiningRoom, FacilityDiningRoomService> implements OnInit {
  constructor(service$: FacilityDiningRoomService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'facility-dining-room-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
