import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ApartmentBedService} from '../../services/apartment-bed.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {ApartmentBed} from '../../models/apartment-bed';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ApartmentBedService, ModalFormService]
})
export class ListComponent extends GridComponent<ApartmentBed, ApartmentBedService> implements OnInit {
  constructor(
    protected service$: ApartmentBedService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = null;
    this.permission = 'persistence-apartment_bed';
    this.name = 'apartment-bed-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
