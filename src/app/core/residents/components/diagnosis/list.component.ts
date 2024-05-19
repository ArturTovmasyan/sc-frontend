import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {DiagnosisService} from '../../services/diagnosis.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Diagnosis} from '../../models/diagnosis';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [DiagnosisService]
})
export class ListComponent extends GridComponent<Diagnosis, DiagnosisService> {
  constructor(service$: DiagnosisService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'diagnosis-list';
  }
}
