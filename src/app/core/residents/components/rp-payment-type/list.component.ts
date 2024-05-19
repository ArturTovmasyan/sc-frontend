import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {RpPaymentTypeService} from '../../services/rp-payment-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {RpPaymentType} from '../../models/rp-payment-type';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [RpPaymentTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<RpPaymentType, RpPaymentTypeService> implements OnInit {
  constructor(
    protected service$: RpPaymentTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-rp_payment_type';
    this.name = 'rp-payment-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
