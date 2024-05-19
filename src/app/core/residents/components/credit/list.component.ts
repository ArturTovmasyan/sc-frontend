import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {CreditService} from '../../services/credit.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Credit} from '../../models/credit';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CreditService, ModalFormService]
})
export class ListComponent extends GridComponent<Credit, CreditService> implements OnInit {
  constructor(
    protected service$: CreditService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-credit';
    this.name = 'credit-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
