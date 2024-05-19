import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {LatePaymentService} from '../../services/late-payment.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {LatePayment} from '../../models/late-payment';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [LatePaymentService, ModalFormService]
})
export class ListComponent extends GridComponent<LatePayment, LatePaymentService> implements OnInit {
  constructor(
    protected service$: LatePaymentService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-late_payment';
    this.name = 'late-payment-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
