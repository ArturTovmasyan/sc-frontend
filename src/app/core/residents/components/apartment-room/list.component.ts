import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ApartmentRoomService} from '../../services/apartment-room.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ApartmentRoom} from '../../models/apartment-room';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ApartmentRoomService]
})
export class ListComponent extends GridComponent<ApartmentRoom, ApartmentRoomService> implements OnInit {
  constructor(service$: ApartmentRoomService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'apartment-room-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
