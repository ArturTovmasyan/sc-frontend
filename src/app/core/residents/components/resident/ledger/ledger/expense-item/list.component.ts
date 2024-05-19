import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TitleService} from '../../../../../../services/title.service';
import {GridComponent} from '../../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentExpenseItemService} from '../../../../../services/resident-expense-item.service';
import {ResidentExpenseItem} from '../../../../../models/resident-expense-item';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-resident-ledger-expense-item',
  templateUrl: '../../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentExpenseItemService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentExpenseItem, ResidentExpenseItemService> implements OnInit {
  constructor(
    protected service$: ResidentExpenseItemService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private route$: ActivatedRoute
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-resident-resident_expense_item';
    this.name = 'resident-expense-item-list';
  }

  ngOnInit(): void {
    this.subscribe('param_id');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'param_id':
        this.$subscriptions[key] = this.route$.paramMap.subscribe(route_params => {
          if (route_params.has('id')) {
            this.params.push({key: 'ledger_id', value: route_params.get('id')});
            super.init();
          }
        });
        break;
      default:
        break;
    }
  }
}
