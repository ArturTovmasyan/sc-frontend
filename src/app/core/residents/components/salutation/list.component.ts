import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {SalutationService} from '../../services/salutation.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Salutation} from '../../models/salutation';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [SalutationService, ModalFormService]
})
export class ListComponent extends GridComponent<Salutation, SalutationService> implements OnInit {
  constructor(
    protected service$: SalutationService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'salutation-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
