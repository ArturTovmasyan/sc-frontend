import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {PaymentTypeService} from '../../services/payment-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {PaymentType} from '../../models/payment-type';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [PaymentTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<PaymentType, PaymentTypeService> implements OnInit {
  constructor(
    protected service$: PaymentTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-payment_type';
    this.name = 'payment-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
