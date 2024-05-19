import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {CareTypeService} from '../../services/care-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {CareType} from '../../models/care-type';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CareTypeService]
})
export class ListComponent extends GridComponent<CareType, CareTypeService> implements OnInit {
  constructor(
    protected service$: CareTypeService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-care-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
