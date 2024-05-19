import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ResidentService} from '../../services/resident.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Resident} from '../../models/resident';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentService]
})
export class ListComponent extends GridComponent<Resident, ResidentService> implements OnInit {
  constructor(service$: ResidentService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'resident-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
