import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {CurrentResidenceService} from '../../services/current-residence.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {CurrentResidence} from '../../models/current-residence';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CurrentResidenceService, ModalFormService]
})
export class ListComponent extends GridComponent<CurrentResidence, CurrentResidenceService> implements OnInit {
  constructor(
    protected service$: CurrentResidenceService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-lead-current_residence';
    this.name = 'lead-current-residence-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
