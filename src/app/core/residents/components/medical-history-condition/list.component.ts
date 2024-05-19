import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {MedicalHistoryConditionService} from '../../services/medical-history-condition.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {MedicalHistoryCondition} from '../../models/medical-history-condition';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [MedicalHistoryConditionService, ModalFormService]
})
export class ListComponent extends GridComponent<MedicalHistoryCondition, MedicalHistoryConditionService> implements OnInit {
  constructor(
    protected service$: MedicalHistoryConditionService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-medical_history_condition';
    this.name = 'medical-history-condition-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
