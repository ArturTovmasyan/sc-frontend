import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {CareLevelService} from '../../services/care-level.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {CareLevel} from '../../models/care-level';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CareLevelService]
})
export class ListComponent extends GridComponent<CareLevel, CareLevelService> {
  constructor(service$: CareLevelService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'care-level-list';
  }
}
