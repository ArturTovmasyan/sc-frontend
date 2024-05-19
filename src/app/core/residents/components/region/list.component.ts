import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {RegionService} from '../../services/region.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Region} from '../../models/region';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [RegionService]
})
export class ListComponent extends GridComponent<Region, RegionService> {
  constructor(service$: RegionService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'region-list';
  }
}
