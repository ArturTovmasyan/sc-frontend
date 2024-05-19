import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TitleService} from '../../../../../../services/title.service';
import {GridComponent} from '../../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentCreditDiscountItemService} from '../../../../../services/resident-credit-discount-item.service';
import {ResidentCreditDiscountItem} from '../../../../../models/resident-credit-discount-item';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';

@Component({
  selector: 'app-resident-ledger-credit-discount-item',
  templateUrl: '../../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentCreditDiscountItemService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentCreditDiscountItem, ResidentCreditDiscountItemService> implements OnInit {
  constructor(
    protected service$: ResidentCreditDiscountItemService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private route$: ActivatedRoute
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-resident-resident_credit_discount_item';
    this.name = 'resident-credit-discount-item-list';
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
