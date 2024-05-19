import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../../services/title.service';
import {CategoryService} from '../../services/category.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './form/form.component';
import {Category} from '../../models/category';
import {ModalFormService} from '../../../../shared/services/modal-form.service';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [CategoryService, ModalFormService]
})
export class ListComponent extends GridComponent<Category, CategoryService> implements OnInit {
  constructor(
    protected service$: CategoryService,
    protected title$: TitleService,
    protected modal$: ModalFormService
  ) {
    super(service$, title$, modal$);

    this.component = FormComponent;

    this.name = 'document-category-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
