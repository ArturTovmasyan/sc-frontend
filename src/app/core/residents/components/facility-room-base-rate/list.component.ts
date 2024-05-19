import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {FacilityRoomBaseRateService} from '../../services/facility-room-base-rate.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {FacilityRoomBaseRate} from '../../models/facility-room-base-rate';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityRoomBaseRateService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityRoomBaseRate, FacilityRoomBaseRateService> implements OnInit {
  constructor(
    protected service$: FacilityRoomBaseRateService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-facility_room_base_rate';
    this.name = 'facility-room-base-rate-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
