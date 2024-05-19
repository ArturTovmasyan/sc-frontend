import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {FacilityRoomService} from '../../services/facility-room.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FacilityRoom} from '../../models/facility-room';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityRoomService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityRoom, FacilityRoomService> implements OnInit {
  constructor(
    protected service$: FacilityRoomService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'facility-room-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
