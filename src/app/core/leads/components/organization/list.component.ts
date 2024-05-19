import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {OrganizationService} from '../../services/organization.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Organization} from '../../models/organization';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [OrganizationService]
})
export class ListComponent extends GridComponent<Organization, OrganizationService> implements OnInit {
  constructor(
    protected service$: OrganizationService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-organization-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
