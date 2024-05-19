import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentCreditItemService} from '../../../../services/resident-credit-item.service';
import {ResidentCreditItem} from '../../../../models/resident-credit-item';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';

@Component({
  selector: 'app-resident-ledger-credit-item',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentCreditItemService, ModalFormService],
})
export class ListComponent extends GridComponent<ResidentCreditItem, ResidentCreditItemService> implements OnInit {
  @Output() reload: EventEmitter<number> = new EventEmitter();

  constructor(
    protected service$: ResidentCreditItemService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;
    this.permission = 'persistence-resident-resident_credit_item';
    this.name = 'resident-credit-item-list';
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            if (this.params.filter(v => v.key === 'resident_id').length === 0) {
              this.params.push({key: 'resident_id', value: next.toString()});
              super.init();
            }
          }
        });
        break;
      default:
        break;
    }
  }

  on_reload() {
    this.reload.emit(Math.random());
  }
}
