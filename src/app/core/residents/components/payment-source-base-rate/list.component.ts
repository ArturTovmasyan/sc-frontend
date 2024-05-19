import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {PaymentSourceBaseRateService} from '../../services/payment-source-base-rate.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {PaymentSourceBaseRate} from '../../models/payment-source-base-rate';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [PaymentSourceBaseRateService, ModalFormService]
})
export class ListComponent extends GridComponent<PaymentSourceBaseRate, PaymentSourceBaseRateService> implements OnInit {
  constructor(
    protected service$: PaymentSourceBaseRateService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-payment_source_base_rate';
    this.name = 'payment-source-base-rate-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
