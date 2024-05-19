import {Component, OnInit} from '@angular/core';
import {FormComponent} from './form/form.component';
import {ResidentRentIncreaseService} from '../../../../services/resident-rent-increase.service';
import {ResidentRentIncrease} from '../../../../models/resident-rent-increase';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {TitleService} from '../../../../../services/title.service';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';

@Component({
  selector: 'app-resident-rent-increase',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentRentIncreaseService, ModalFormService]
})
export class ListComponent extends GridComponent<ResidentRentIncrease, ResidentRentIncreaseService> implements OnInit {
  constructor(
    protected service$: ResidentRentIncreaseService,
    protected title$: TitleService,
    protected modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService
  ) {
    super(service$, title$, modal$);

    this.card = false;
    this.searchable = false;
    this.component = FormComponent;

    this.name = 'resident-rent-increase-list';
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
}
