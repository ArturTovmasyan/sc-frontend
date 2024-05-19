import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {KeyFinanceTypeService} from '../../services/key-finance-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {KeyFinanceType} from '../../models/key-finance-type';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [KeyFinanceTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<KeyFinanceType, KeyFinanceTypeService> implements OnInit {
  constructor(
    protected service$: KeyFinanceTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-key_finance_type';
    this.name = 'key-finance-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
