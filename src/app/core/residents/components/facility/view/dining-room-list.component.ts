import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from '../../facility-dining-room/form/form.component';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FacilityDiningRoomService} from '../../../services/facility-dining-room.service';
import {FacilityDiningRoom} from '../../../models/facility-dining-room';

@Component({
  selector: 'app-facility-dining-room',
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityDiningRoomService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityDiningRoom, FacilityDiningRoomService> implements OnInit, AfterViewInit {
  @Input() facility_id: Number;

  constructor(
    protected service$: FacilityDiningRoomService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'facility-dining-room-list';
  }

  ngOnInit(): void {
    this.params.push({key: 'facility_id', value: this.facility_id.toString()});

    super.init();
  }

  ngAfterViewInit() {
    this._btnBar.preset_modal_form_data = (form: FormGroup) => {
      form.get('facility_id').setValue(this.facility_id);
      form.get('facility_id').disable();
    };
  }

}
