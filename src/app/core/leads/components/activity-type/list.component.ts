import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {ActivityTypeService} from '../../services/activity-type.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {ActivityType} from '../../models/activity-type';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ActivityTypeService, ModalFormService]
})
export class ListComponent extends GridComponent<ActivityType, ActivityTypeService> implements OnInit {
  constructor(
    protected service$: ActivityTypeService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'lead-activity-type-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
