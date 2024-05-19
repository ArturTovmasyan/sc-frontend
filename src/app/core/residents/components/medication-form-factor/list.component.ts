import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {MedicationFormFactorService} from '../../services/medication-form-factor.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {MedicationFormFactor} from '../../models/medication-form-factor';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [MedicationFormFactorService]
})
export class ListComponent extends GridComponent<MedicationFormFactor, MedicationFormFactorService> implements OnInit {
  constructor(service$: MedicationFormFactorService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'medication-form-factor-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
