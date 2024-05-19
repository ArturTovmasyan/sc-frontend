import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {AllergenService} from '../../services/allergen.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Allergen} from '../../models/allergen';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [AllergenService, ModalFormService]
})
export class ListComponent extends GridComponent<Allergen, AllergenService> implements OnInit {
  constructor(
    protected service$: AllergenService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;
    this.permission = 'persistence-common-allergen';
    this.name = 'allergen-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
