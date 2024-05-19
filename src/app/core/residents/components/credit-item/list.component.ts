import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {CreditItemService} from '../../services/credit-item.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {CreditItem} from '../../models/credit-item';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CreditItemService, ModalFormService]
})
export class ListComponent extends GridComponent<CreditItem, CreditItemService> implements OnInit {
  constructor(
    protected service$: CreditItemService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-credit_item';
    this.name = 'credit-item-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
