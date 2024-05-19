import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {DiscountItemService} from '../../services/discount-item.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {DiscountItem} from '../../models/discount-item';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [DiscountItemService, ModalFormService]
})
export class ListComponent extends GridComponent<DiscountItem, DiscountItemService> implements OnInit {
  constructor(
    protected service$: DiscountItemService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-discount_item';
    this.name = 'discount-item-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
