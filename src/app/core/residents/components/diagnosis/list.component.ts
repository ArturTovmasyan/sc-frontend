import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {DiagnosisService} from '../../services/diagnosis.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Diagnosis} from '../../models/diagnosis';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [DiagnosisService, ModalFormService]
})
export class ListComponent extends GridComponent<Diagnosis, DiagnosisService> implements OnInit {
  constructor(
    protected service$: DiagnosisService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-diagnosis';
    this.name = 'diagnosis-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
