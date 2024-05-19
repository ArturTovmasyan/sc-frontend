import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ExpenseItemService} from '../../services/expense-item.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ExpenseItem} from '../../models/expense-item';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ExpenseItemService, ModalFormService]
})
export class ListComponent extends GridComponent<ExpenseItem, ExpenseItemService> implements OnInit {
  constructor(
    protected service$: ExpenseItemService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-expense_item';
    this.name = 'expense-item-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
