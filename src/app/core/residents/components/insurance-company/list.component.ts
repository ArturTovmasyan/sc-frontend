import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {InsuranceCompanyService} from '../../services/insurance-company.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {InsuranceCompany} from '../../models/insurance-company';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [InsuranceCompanyService]
})
export class ListComponent extends GridComponent<InsuranceCompany, InsuranceCompanyService> implements OnInit {
  constructor(
    protected service$: InsuranceCompanyService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'insurance-company-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
