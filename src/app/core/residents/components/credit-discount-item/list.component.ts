import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {CreditDiscountItemService} from '../../services/credit-discount-item.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {CreditDiscountItem} from '../../models/credit-discount-item';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CreditDiscountItemService, ModalFormService]
})
export class ListComponent extends GridComponent<CreditDiscountItem, CreditDiscountItemService> implements OnInit {
  constructor(
    protected service$: CreditDiscountItemService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-credit_discount_item';
    this.name = 'credit-discount-item-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
