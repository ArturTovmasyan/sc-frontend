import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ResidentDietService} from '../../services/resident-diet.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentDiet} from '../../models/resident-diet';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentDietService]
})
export class ListComponent extends GridComponent<ResidentDiet, ResidentDietService> {
  constructor(service$: ResidentDietService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'resident-diet-list';
  }
}
