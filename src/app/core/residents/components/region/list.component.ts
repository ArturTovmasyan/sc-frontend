import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {RegionService} from '../../services/region.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Region} from '../../models/region';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [RegionService, ModalFormService]
})
export class ListComponent extends GridComponent<Region, RegionService> implements OnInit {
  constructor(
    protected service$: RegionService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-region';
    this.name = 'region-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
