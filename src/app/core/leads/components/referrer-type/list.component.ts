import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ReferrerTypeService} from '../../services/referrer-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ReferrerType} from '../../models/referrer-type';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ReferrerTypeService]
})
export class ListComponent extends GridComponent<ReferrerType, ReferrerTypeService> implements OnInit {
  constructor(
    protected service$: ReferrerTypeService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-referrer-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
