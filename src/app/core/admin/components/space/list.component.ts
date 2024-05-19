import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {SpaceService} from '../../services/space.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Space} from '../../../models/space';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [SpaceService, ModalFormService]
})
export class ListComponent extends GridComponent<Space, SpaceService> implements OnInit {
  constructor(
    protected service$: SpaceService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'space-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
