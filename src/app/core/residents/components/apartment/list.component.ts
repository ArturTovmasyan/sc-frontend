import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ApartmentService} from '../../services/apartment.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Apartment} from '../../models/apartment';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ApartmentService, ModalFormService]
})
export class ListComponent extends GridComponent<Apartment, ApartmentService> implements OnInit {
  constructor(
    protected service$: ApartmentService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'apartment-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
