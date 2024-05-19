import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {FacilityService} from '../../services/facility.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Facility} from '../../models/facility';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [FacilityService, ModalFormService]
})
export class ListComponent extends GridComponent<Facility, FacilityService> implements OnInit {
  constructor(
    protected service$: FacilityService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-facility';
    this.name = 'facility-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
