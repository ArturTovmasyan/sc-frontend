import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ExpenseService} from '../../services/expense.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Expense} from '../../models/expense';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ExpenseService, ModalFormService]
})
export class ListComponent extends GridComponent<Expense, ExpenseService> implements OnInit {
  constructor(
    protected service$: ExpenseService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-expense';
    this.name = 'expense-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
