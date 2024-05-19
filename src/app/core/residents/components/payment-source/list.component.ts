import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {PaymentSourceService} from '../../services/payment-source.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {PaymentSource} from '../../models/payment-source';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [PaymentSourceService, ModalFormService]
})
export class ListComponent extends GridComponent<PaymentSource, PaymentSourceService> implements OnInit {
  constructor(
    protected service$: PaymentSourceService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-payment_source';
    this.name = 'payment-source-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
