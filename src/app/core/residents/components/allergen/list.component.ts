import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {AllergenService} from '../../services/allergen.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Allergen} from '../../models/allergen';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [AllergenService]
})
export class ListComponent extends GridComponent<Allergen, AllergenService> implements OnInit {
  constructor(
    protected service$: AllergenService,
    protected title$: TitleService,
    protected modal$: NzModalService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'allergen-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
