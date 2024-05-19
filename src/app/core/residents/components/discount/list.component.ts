import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {DiscountService} from '../../services/discount.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Discount} from '../../models/discount';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [DiscountService, ModalFormService]
})
export class ListComponent extends GridComponent<Discount, DiscountService> implements OnInit {
  constructor(
    protected service$: DiscountService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-discount';
    this.name = 'credit-discount';
  }

  ngOnInit(): void {
    super.init();
  }
}
