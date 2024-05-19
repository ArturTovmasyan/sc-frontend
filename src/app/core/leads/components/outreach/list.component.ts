import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {OutreachService} from '../../services/outreach.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Outreach} from '../../models/outreach';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [OutreachService]
})
export class ListComponent extends GridComponent<Outreach, OutreachService> implements OnInit {
  constructor(
    protected service$: OutreachService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-outreach-list';
  }

  ngOnInit(): void {
    super.init();
  }

}
