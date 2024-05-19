import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {EventDefinitionService} from '../../services/event-definition.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {EventDefinition} from '../../models/event-definition';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [EventDefinitionService, ModalFormService]
})
export class ListComponent extends GridComponent<EventDefinition, EventDefinitionService> implements OnInit {
  constructor(
    protected service$: EventDefinitionService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-event_definition';
    this.name = 'event-definition-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
