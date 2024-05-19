import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {InsuranceCompanyService} from '../../services/insurance-company.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {InsuranceCompany} from '../../models/insurance-company';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [InsuranceCompanyService, ModalFormService]
})
export class ListComponent extends GridComponent<InsuranceCompany, InsuranceCompanyService> implements OnInit {
  constructor(
    protected service$: InsuranceCompanyService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-insurance_company';
    this.name = 'insurance-company-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
