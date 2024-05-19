import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {EventDefinitionService} from '../../services/event-definition.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {EventDefinition} from '../../models/event-definition';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [EventDefinitionService]
})
export class ListComponent extends GridComponent<EventDefinition, EventDefinitionService> {
  constructor(service$: EventDefinitionService, title$: TitleService, modal$: NzModalService) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'event-definition-list';
  }
}
