import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {MedicationService} from '../../services/medication.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Medication} from '../../models/medication';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [MedicationService, ModalFormService]
})
export class ListComponent extends GridComponent<Medication, MedicationService> implements OnInit {
  constructor(
    protected service$: MedicationService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-medication';
    this.name = 'medication-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
