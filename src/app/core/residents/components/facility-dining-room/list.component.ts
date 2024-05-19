import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {FacilityDiningRoomService} from '../../services/facility-dining-room.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FacilityDiningRoom} from '../../models/facility-dining-room';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityDiningRoomService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityDiningRoom, FacilityDiningRoomService> implements OnInit {
  constructor(
    protected service$: FacilityDiningRoomService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-dining_room';
    this.name = 'facility-dining-room-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
