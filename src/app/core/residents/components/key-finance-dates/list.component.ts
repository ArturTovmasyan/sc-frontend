import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {KeyFinanceDatesService} from '../../services/key-finance-dates.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {KeyFinanceDates} from '../../models/key-finance-dates';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [KeyFinanceDatesService, ModalFormService]
})
export class ListComponent extends GridComponent<KeyFinanceDates, KeyFinanceDatesService> implements OnInit {
  constructor(
    protected service$: KeyFinanceDatesService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-key_finance_dates';
    this.name = 'key-finance-dates-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
