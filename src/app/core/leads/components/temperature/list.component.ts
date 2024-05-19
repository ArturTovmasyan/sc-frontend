import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {TemperatureService} from '../../services/temperature.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Temperature} from '../../models/temperature';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [TemperatureService]
})
export class ListComponent extends GridComponent<Temperature, TemperatureService> implements OnInit {
  constructor(
    protected service$: TemperatureService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-temperature-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
