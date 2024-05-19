import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentRentService} from '../../../services/resident-rent.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentRent} from '../../../models/resident-rent';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentRentService]
})
export class ListComponent extends GridComponent<ResidentRent, ResidentRentService> {
  constructor(service$: ResidentRentService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-rent-list';
  }
}
