import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {CityStateZipService} from '../../services/city-state-zip.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {CityStateZip} from '../../models/city-state-zip';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CityStateZipService]
})
export class ListComponent extends GridComponent<CityStateZip, CityStateZipService> {
  constructor(service$: CityStateZipService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'city-state-zip-list';
  }
}
