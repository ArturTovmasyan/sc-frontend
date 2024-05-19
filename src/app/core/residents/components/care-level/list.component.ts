import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {CareLevelService} from '../../services/care-level.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {CareLevel} from '../../models/care-level';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CareLevelService, ModalFormService]
})
export class ListComponent extends GridComponent<CareLevel, CareLevelService> implements OnInit {
  constructor(
    protected service$: CareLevelService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-care_level';
    this.name = 'care-level-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
