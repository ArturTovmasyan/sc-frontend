import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
export class ListComponent extends GridComponent<ResidentAllergyMedication, ResidentAllergyMedicationService> implements OnInit {
  constructor(service$: ResidentAllergyMedicationService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.card = false;
    this.component = FormComponent;

    this.name = 'resident-allergy-medication-list';
  }

  ngOnInit(): void {
    const resident_id = this.route$.snapshot.parent.params['id'];
    this.params.push({key: 'resident_id', value: resident_id});

    super.init();
  }
}
