import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentMedicalHistoryService} from '../../../../services/resident-medical-history.service';
import {ResidentMedicalHistory} from '../../../../models/resident-medical-history';

@Component({
  selector: 'app-resident-history-medical-history',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentMedicalHistoryService]
})
export class ListComponent extends GridComponent<ResidentMedicalHistory, ResidentMedicalHistoryService> {
  constructor(service$: ResidentMedicalHistoryService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-medical-history-list';
  }
}
