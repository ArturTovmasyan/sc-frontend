import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../../services/title.service';
import {GridComponent} from '../../../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ResidentAllergyMedicationService} from '../../../../services/resident-allergy-medication.service';
import {ResidentAllergyMedication} from '../../../../models/resident-allergy-medication';

@Component({
  selector: 'app-resident-history-allergy-medication',
  templateUrl: '../../../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentAllergyMedicationService]
})
export class ListComponent extends GridComponent<ResidentAllergyMedication, ResidentAllergyMedicationService> {
  constructor(service$: ResidentAllergyMedicationService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-allergy-medication-list';
  }
}
