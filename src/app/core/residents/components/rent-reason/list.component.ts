import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {RentReasonService} from '../../services/rent-reason.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {RentReason} from '../../models/rent-reason';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [RentReasonService, ModalFormService]
})
export class ListComponent extends GridComponent<RentReason, RentReasonService> implements OnInit {
  constructor(
    protected service$: RentReasonService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'rent-reason-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
