import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {MedicationFormFactorService} from '../../services/medication-form-factor.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {MedicationFormFactor} from '../../models/medication-form-factor';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [MedicationFormFactorService, ModalFormService]
})
export class ListComponent extends GridComponent<MedicationFormFactor, MedicationFormFactorService> implements OnInit {
  constructor(
    protected service$: MedicationFormFactorService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-medication_form_factor';
    this.name = 'medication-form-factor-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
