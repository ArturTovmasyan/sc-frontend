import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {TemperatureService} from '../../services/temperature.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Temperature} from '../../models/temperature';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [TemperatureService, ModalFormService]
})
export class ListComponent extends GridComponent<Temperature, TemperatureService> implements OnInit {
  constructor(
    protected service$: TemperatureService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-temperature-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
