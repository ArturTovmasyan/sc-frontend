import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {FacilityRoomTypeService} from '../../services/facility-room-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FacilityRoomType} from '../../models/facility-room-type';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityRoomTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityRoomType, FacilityRoomTypeService> implements OnInit {
  constructor(
    protected service$: FacilityRoomTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-facility_room_type';
    this.name = 'facility-room-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
