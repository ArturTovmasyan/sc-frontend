import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {PhysicianService} from '../../services/physician.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Physician} from '../../models/physician';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [PhysicianService]
})
export class ListComponent extends GridComponent<Physician, PhysicianService> implements OnInit {
  constructor(
    protected service$: PhysicianService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'physician-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
