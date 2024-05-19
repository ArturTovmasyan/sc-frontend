import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {OutreachTypeService} from '../../services/outreach-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {OutreachType} from '../../models/outreach-type';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [OutreachTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<OutreachType, OutreachTypeService> implements OnInit {
  constructor(
    protected service$: OutreachTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-outreach-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
