import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ApartmentRoomService} from '../../services/apartment-room.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ApartmentRoom} from '../../models/apartment-room';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ApartmentRoomService, ModalFormService]
})
export class ListComponent extends GridComponent<ApartmentRoom, ApartmentRoomService> implements OnInit {
  constructor(
    protected service$: ApartmentRoomService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'apartment-room-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
