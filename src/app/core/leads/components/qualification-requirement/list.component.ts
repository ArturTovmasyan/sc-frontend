import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {QualificationRequirementService} from '../../services/qualification-requirement.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {QualificationRequirement} from '../../models/qualification-requirement';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [QualificationRequirementService, ModalFormService]
})
export class ListComponent extends GridComponent<QualificationRequirement, QualificationRequirementService> implements OnInit {
  constructor(
    protected service$: QualificationRequirementService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-qualification_requirement';
    this.name = 'lead-qualification-requirement-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
