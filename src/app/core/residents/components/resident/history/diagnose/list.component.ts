import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentDiagnoseService} from '../../../../services/resident-diagnose.service';
import {ResidentDiagnose} from '../../../../models/resident-diagnose';

@Component({
  selector: 'app-resident-history-diagnose',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentDiagnoseService]
})
export class ListComponent extends GridComponent<ResidentDiagnose, ResidentDiagnoseService> {
  constructor(service$: ResidentDiagnoseService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-diagnoses-list';
  }
}
