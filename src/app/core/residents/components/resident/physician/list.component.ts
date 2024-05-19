import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {GridComponent} from '../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentPhysicianService} from '../../../services/resident-physician.service';
import {ResidentPhysician} from '../../../models/resident-physician';

@Component({
  templateUrl: '../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentPhysicianService]
})
export class ListComponent extends GridComponent<ResidentPhysician, ResidentPhysicianService> {
  constructor(service$: ResidentPhysicianService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-physician-list';
  }
}
