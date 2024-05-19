import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {FacilityBedService} from '../../services/facility-bed.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FacilityBed} from '../../models/facility-bed';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityBedService, ModalFormService]
})
export class ListComponent extends GridComponent<FacilityBed, FacilityBedService> implements OnInit {
  constructor(
    protected service$: FacilityBedService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = null;

    this.name = 'facility-bed-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
