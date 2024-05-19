import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {DietService} from '../../services/diet.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Diet} from '../../models/diet';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [DietService, ModalFormService]
})
export class ListComponent extends GridComponent<Diet, DietService> implements OnInit {
  constructor(
    protected service$: DietService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'diet-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
